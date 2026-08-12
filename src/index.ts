/**
 * Durable evidence-first deep-research workflow over existing web and subagent tools.
 * @module @deepseek-ai/dsh-deepresearch
 */

import { randomUUID } from 'node:crypto'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { GatewayService, Remote } from '@deepseek-ai/dsh-type-meta'
import { deepResearchDomainSpec } from './spec.ts'
import { ResearchId } from './types.ts'
import type {
  ResearchCompleteRequest,
  ResearchEvidence,
  ResearchEvidenceRequest,
  ResearchGetRequest,
  ResearchListRequest,
  ResearchListResult,
  ResearchProject,
  ResearchStartRequest,
} from './types.ts'

export type * from './types.ts'
export { ResearchId } from './types.ts'
export { deepResearchDomainSpec, researchEvidenceSchema, researchProjectSchema } from './spec.ts'

/** Required project, evidence, and report limits. */
export interface Config {
  readonly maxProjects: number
  readonly maxEvidencePerProject: number
  readonly maxReportChars: number
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    deepResearch: DeepResearchService
  }
}

const EVIDENCE_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    source: { type: 'string', required: true },
    url: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
    summary: { type: 'string', required: true },
  },
} as const

const PROJECT_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    id: { type: 'string', required: true },
    question: { type: 'string', required: true },
    depth: { type: 'string', required: true, enum: ['quick', 'standard', 'deep'] },
    phase: { type: 'string', required: true, enum: ['planning', 'researching', 'synthesizing', 'complete'] },
    plan: { type: 'array', required: true, items: { type: 'string' } },
    evidence: { type: 'array', required: true, items: EVIDENCE_SCHEMA },
    report: { required: true, oneOf: [{ type: 'string' }, { type: 'null' }] },
    createdAt: { type: 'number', required: true },
    updatedAt: { type: 'number', required: true },
  },
} as const

/** Deep-research project service. */
export class DeepResearchService extends GatewayService {
  static inject = ['storageDomain', 'tools', 'systemPrompt']

  /** Loader validation for deployment-varying research limits. */
  static Config: s<Config> = s.object({
    maxProjects: s.number().step(1).min(1).required(),
    maxEvidencePerProject: s.number().step(1).min(1).required(),
    maxReportChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<ResearchId, ResearchProject>
  private mutationTail: Promise<void> = Promise.resolve()

  /**
   * @param ctx - Host context carrying storage, prompt, and tool registries.
   * @param config - Project and content limits.
   */
  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'deepResearch')
  }

  /** Open storage and publish workflow guidance and tools. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'deepresearch.domainClose')
    this.table = domain.table('projects')
    this.ctx.systemPrompt.section({
      name: 'deepresearch',
      order: 170,
      text: 'For an explicit deep-research request, create a project with deep_research_start before gathering evidence. Use the composed web and subagent tools to investigate the approved plan, add only source-backed findings with deep_research_add_evidence, and finish with deep_research_complete after comparing evidence and stating uncertainty. Never invent a source or claim that a project is complete before its final report is saved.',
    })
    this.registerTools()
  }

  /** List projects matching optional text and phase filters. */
  @Remote('list')
  list(request: ResearchListRequest): ResearchListResult {
    const query = request.query?.trim().toLocaleLowerCase()
    const projects = [...this.requireTable().entries()]
      .map(([, project]) => snapshot(project))
      .filter(project => request.phase === undefined || project.phase === request.phase)
      .filter(project => query === undefined || query === ''
        || `${project.question}\n${project.report ?? ''}`.toLocaleLowerCase().includes(query))
      .sort((left, right) => right.updatedAt - left.updatedAt)
    return { projects }
  }

  /** Read one exact project. */
  @Remote('get')
  get(request: ResearchGetRequest): ResearchProject | null {
    const project = this.requireTable().get(request.id)
    return project === undefined ? null : snapshot(project)
  }

  /** Create a project with a non-empty investigation plan. */
  @Remote('start')
  start(request: ResearchStartRequest): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      if (table.size >= this.config.maxProjects) {
        throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`)
      }
      const plan = request.plan.map((step, index) => requiredText(step, `plan[${index}]`))
      if (plan.length === 0) throw new TypeError('deepresearch: plan must contain at least one step')
      const now = Date.now()
      const project = snapshot({
        id: ResearchId(`research-${randomUUID()}`),
        question: requiredText(request.question, 'question'),
        depth: request.depth,
        phase: 'planning',
        plan,
        evidence: [],
        report: null,
        createdAt: now,
        updatedAt: now,
      })
      await table.put(project.id, project)
      return snapshot(project)
    })
  }

  /** Attach one finding and move the project into active investigation. */
  @Remote('addEvidence')
  addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const current = requireProject(table, request.id)
      if (current.phase === 'complete') throw new Error(`deepresearch: project ${request.id} is complete`)
      if (current.evidence.length >= this.config.maxEvidencePerProject) {
        throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`)
      }
      const evidence: ResearchEvidence = {
        source: requiredText(request.source, 'source'),
        url: request.url === undefined ? null : requiredText(request.url, 'url'),
        summary: requiredText(request.summary, 'summary'),
      }
      const project = snapshot({
        ...current,
        phase: 'researching',
        evidence: [...current.evidence, evidence],
        updatedAt: Math.max(Date.now(), current.updatedAt),
      })
      await table.put(project.id, project)
      return snapshot(project)
    })
  }

  /** Save the final synthesis and close the project. */
  @Remote('complete')
  complete(request: ResearchCompleteRequest): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable()
      const current = requireProject(table, request.id)
      const report = requiredText(request.report, 'report')
      if (report.length > this.config.maxReportChars) {
        throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`)
      }
      const project = snapshot({
        ...current,
        phase: 'complete',
        report,
        updatedAt: Math.max(Date.now(), current.updatedAt),
      })
      await table.put(project.id, project)
      return snapshot(project)
    })
  }

  /** Register model-facing workflow tools over the service. */
  private registerTools(): void {
    this.ctx.tools.register(defineTool({
      name: 'deep_research_start',
      description: 'Create a durable deep-research project with an explicit investigation plan.',
      parameters: {
        question: { type: 'string', required: true, description: 'The exact research question.' },
        depth: { type: 'string', required: true, enum: ['quick', 'standard', 'deep'], description: 'Investigation depth.' },
        plan: { type: 'array', required: true, items: { type: 'string' }, description: 'Ordered evidence-gathering steps.' },
      },
      output: {
        schema: PROJECT_SCHEMA,
        render: (_args, value) => [{ type: 'text', text: `Created research project ${value.id} with ${value.plan.length} steps.` }],
      },
      execute: async args => this.start(args),
      presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Plan deep research', rawInput: args.question }),
    }))

    this.ctx.tools.register(defineTool({
      name: 'deep_research_add_evidence',
      description: 'Attach one verified source-backed finding to an active research project.',
      parameters: {
        id: { type: 'string', required: true, description: 'Research project id.' },
        source: { type: 'string', required: true, description: 'Source title or publisher.' },
        url: { type: 'string', description: 'Source URL when available.' },
        summary: { type: 'string', required: true, description: 'Finding supported by the source.' },
      },
      output: { schema: PROJECT_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Saved evidence ${value.evidence.length} for ${value.id}.` }] },
      execute: async args => this.addEvidence({ ...args, id: ResearchId(args.id) }),
      presentCall: args => ({ card: 'generic', kind: 'search', title: 'Add research evidence', rawInput: args.source }),
    }))

    this.ctx.tools.register(defineTool({
      name: 'deep_research_complete',
      description: 'Save the final evidence-based report and mark a research project complete.',
      parameters: {
        id: { type: 'string', required: true, description: 'Research project id.' },
        report: { type: 'string', required: true, description: 'Final report with source attribution and uncertainty.' },
      },
      output: { schema: PROJECT_SCHEMA, render: (_args, value) => [{ type: 'text', text: `Completed research project ${value.id}.` }] },
      execute: async args => this.complete({ ...args, id: ResearchId(args.id) }),
      presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Complete deep research', rawInput: args.id }),
    }))

    this.ctx.tools.register(defineTool({
      name: 'deep_research_list',
      description: 'List durable research projects before starting duplicate work or resuming an investigation.',
      parameters: {
        query: { type: 'string', description: 'Optional text query.' },
        phase: { type: 'string', enum: ['planning', 'researching', 'synthesizing', 'complete'], description: 'Optional phase filter.' },
      },
      output: {
        schema: { type: 'object', additionalProperties: false, properties: { projects: { type: 'array', required: true, items: PROJECT_SCHEMA } } },
        render: (_args, value) => [{ type: 'text', text: value.projects.length === 0
          ? 'No research projects matched.'
          : value.projects.map(project => `- [${project.phase}] ${project.question} (${project.id})`).join('\n') }],
      },
      execute: args => Promise.resolve(this.list(args)),
      presentCall: args => ({ card: 'generic', kind: 'search', title: 'List research projects', rawInput: args.query ?? args.phase }),
    }))
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.mutationTail.then(operation)
    this.mutationTail = result.then(() => undefined, () => undefined)
    return result
  }

  private requireTable(): KvTable<ResearchId, ResearchProject> {
    if (this.table === undefined) throw new Error('deepresearch: durable domain is not initialized')
    return this.table
  }
}

function requiredText(value: string, field: string): string {
  const text = value.trim()
  if (text === '') throw new TypeError(`deepresearch: ${field} must not be blank`)
  return text
}

function requireProject(table: KvTable<ResearchId, ResearchProject>, id: ResearchId): ResearchProject {
  const project = table.get(id)
  if (project === undefined) throw new Error(`deepresearch: project ${id} not found`)
  return project
}

function snapshot(project: ResearchProject): ResearchProject {
  return Object.freeze({
    ...project,
    plan: [...project.plan],
    evidence: project.evidence.map(item => Object.freeze({ ...item })),
  })
}

export default DeepResearchService
