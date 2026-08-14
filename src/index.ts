/**
 * Evidence-first Deep Research workspace over existing Web and subagent Tools.
 * @module @deepseek-ai/dsh-deepresearch
 */

import { randomUUID } from 'node:crypto'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { deepResearchDomainSpec } from './spec.ts'
import { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts'
import type {
  ResearchCompleteRequest, ResearchConfirmRequest, ResearchDeleteRequest, ResearchDeleteResult,
  ResearchEvidence, ResearchEvidenceRequest, ResearchFailRequest, ResearchGetRequest,
  ResearchListRequest, ResearchListResult, ResearchPlanUpdateRequest, ResearchProject,
  ResearchQuestion, ResearchQuestionUpdateRequest, ResearchStartRequest,
} from './types.ts'

export type * from './types.ts'
export { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts'
export { deepResearchDomainSpec, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema } from './spec.ts'

/** Required project, evidence, and report limits. */
export interface Config {
  /** Maximum durable research projects. */
  readonly maxProjects: number
  /** Maximum planned sub-questions in one project. */
  readonly maxQuestions: number
  /** Maximum success criteria for one sub-question. */
  readonly maxCriteriaPerQuestion: number
  /** Maximum source-backed evidence items in one project. */
  readonly maxEvidencePerProject: number
  /** Maximum characters in a saved final report. */
  readonly maxReportChars: number
}

declare module '@deepseek-ai/cordis' { interface Context { deepResearch: DeepResearchService } }

const TEXT_OUTPUT = { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true } } } as const

/** Durable Codemini-style Deep Research project service. */
export class DeepResearchService extends TypertRemoteService {
  static inject = ['storageDomain', 'tools', 'systemPrompt']
  static Config: s<Config> = s.object({
    maxProjects: s.number().step(1).min(1).required(), maxQuestions: s.number().step(1).min(1).required(),
    maxCriteriaPerQuestion: s.number().step(1).min(1).required(), maxEvidencePerProject: s.number().step(1).min(1).required(), maxReportChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<ResearchId, ResearchProject>
  private mutationTail: Promise<void> = Promise.resolve()

  /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
  constructor(ctx: Context, private readonly config: Config) { super(ctx, 'deepResearch') }

  /** Open storage and publish workflow guidance and Tools. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'deepresearch.domainClose')
    this.table = domain.table('projects')
    this.ctx.systemPrompt.section({ name: 'deepresearch', order: 170, text: 'For explicit deep research, create or resume a project before investigation. Refine and confirm its question plan, then use the composed Web and subagent tools. Save each source-backed claim against its sub-question and success criteria. Mark coverage honestly, retain limitations, and save the final report only after comparing accepted evidence. Never invent sources, evidence, coverage, or completion.' })
    this.registerTools()
  }

  /**
   * List projects matching optional text and phase filters.
   * @param request - optional project filters.
   * @returns matching projects ordered by newest edit.
   */
  @Remote('list')
  list(request: ResearchListRequest): ResearchListResult {
    const query = request.query?.trim().toLocaleLowerCase()
    return { projects: [...this.requireTable().entries()].map(([, project]) => snapshot(project)).filter(project => request.phase === undefined || project.phase === request.phase).filter(project => query === undefined || query === '' || researchText(project).includes(query)).sort((left, right) => right.updatedAt - left.updatedAt) }
  }

  /**
   * Read one exact project.
   * @param request - project identity to read.
   * @returns detached project data, or null when absent.
   */
  @Remote('get')
  get(request: ResearchGetRequest): ResearchProject | null { const project = this.requireTable().get(request.id); return project === undefined ? null : snapshot(project) }

  /**
   * Create a draft plan with sub-questions and success criteria.
   * @param request - research objective and initial question plan.
   * @returns the detached stored project.
   */
  @Remote('start')
  start(request: ResearchStartRequest): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable(); if (table.size >= this.config.maxProjects) throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`)
      const questions = this.buildQuestions(request.questions); const now = Date.now(); const id = ResearchId(`research-${randomUUID()}`)
      const project = snapshot({ id, title: optionalText(request.title) || `🔬 ${requiredText(request.question, 'question').slice(0, 64)}`, question: requiredText(request.question, 'question'), goal: optionalText(request.goal), constraints: optionalText(request.constraints), seedText: optionalText(request.seedText), depth: request.depth, phase: 'awaiting_plan_confirm', planConfirmed: false, questions, evidence: [], conclusions: [], limitations: [], report: null, budget: budgetFor(request.depth), createdAt: now, updatedAt: now })
      await table.put(id, project); return snapshot(project)
    })
  }

  /**
   * Replace an unconfirmed project plan.
   * @param request - replacement plan and project identity.
   * @returns the updated detached project.
   */
  @Remote('updatePlan')
  updatePlan(request: ResearchPlanUpdateRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      if (project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is confirmed`)
      return { ...project, goal: request.goal.trim(), constraints: request.constraints.trim(), depth: request.depth, questions: this.buildQuestions(request.questions), budget: budgetFor(request.depth), phase: 'awaiting_plan_confirm' }
    })
  }

  /**
   * Lock the plan and make the project ready for investigation.
   * @param request - project identity to confirm.
   * @returns the updated detached project.
   */
  @Remote('confirmPlan')
  confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject> { return this.update(request.id, project => ({ ...project, planConfirmed: true, phase: 'investigating' })) }

  /**
   * Attach one source-backed claim to a planned sub-question.
   * @param request - evidence attribution and claim content.
   * @returns the updated detached project.
   */
  @Remote('addEvidence')
  addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      if (!project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is not confirmed`)
      if (project.evidence.length >= this.config.maxEvidencePerProject) throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`)
      const question = project.questions.find(item => item.id === request.questionId); if (question === undefined) throw new Error(`deepresearch: question ${request.questionId} not found`)
      const criteria = new Set(question.criteria.map(item => item.id)); for (const id of request.criterionIds ?? []) if (!criteria.has(id)) throw new Error(`deepresearch: criterion ${id} not found`)
      const evidence: ResearchEvidence = { id: ResearchEvidenceId(`evidence-${randomUUID()}`), questionId: request.questionId, criterionIds: [...(request.criterionIds ?? [])], source: requiredText(request.source, 'source'), url: optionalText(request.url) || null, snippet: optionalText(request.snippet), claim: requiredText(request.claim, 'claim'), confidence: request.confidence, createdAt: Date.now() }
      return { ...project, phase: 'investigating', evidence: [...project.evidence, evidence], budget: { ...project.budget, fetchesUsed: Math.min(project.budget.maxFetches, project.budget.fetchesUsed + (evidence.url === null ? 0 : 1)) } }
    })
  }

  /**
   * Update sub-question and criterion coverage after evidence review.
   * @param request - reviewed question progress and criteria.
   * @returns the updated detached project.
   */
  @Remote('updateQuestion')
  updateQuestion(request: ResearchQuestionUpdateRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      const index = project.questions.findIndex(item => item.id === request.questionId); if (index < 0) throw new Error(`deepresearch: question ${request.questionId} not found`)
      const current = project.questions[index] as ResearchQuestion; const questions = [...project.questions]; questions[index] = { ...current, status: request.status, criteria: request.criteria ?? current.criteria }
      const settled = questions.every(question => ['covered', 'partial', 'blocked'].includes(question.status))
      return { ...project, questions, phase: settled ? 'ready_for_report' : 'investigating' }
    })
  }

  /**
   * Save a final or explicitly partial report with conclusions and limitations.
   * @param request - report content and completion state.
   * @returns the completed detached project.
   */
  @Remote('complete')
  complete(request: ResearchCompleteRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      const report = requiredText(request.report, 'report'); if (report.length > this.config.maxReportChars) throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`)
      if (project.evidence.length === 0) throw new Error(`deepresearch: project ${project.id} has no evidence`)
      return { ...project, phase: request.partial === true ? 'incomplete' : 'done', report, conclusions: normalizeList(request.conclusions ?? project.conclusions), limitations: normalizeList(request.limitations ?? project.limitations) }
    })
  }

  /**
   * Record an aborted or failed investigation without losing evidence.
   * @param request - failure reason and termination type.
   * @returns the updated detached project.
   */
  @Remote('fail')
  fail(request: ResearchFailRequest): Promise<ResearchProject> { return this.update(request.id, project => ({ ...project, phase: request.aborted === true ? 'aborted' : 'failed', limitations: normalizeList([...project.limitations, requiredText(request.reason, 'reason')]) })) }

  /**
   * Delete a project; absence is a stable successful outcome.
   * @param request - project identity to delete.
   * @returns whether the project existed.
   */
  @Remote('delete')
  delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult> { return this.enqueue(async () => { const table = this.requireTable(); const deleted = table.get(request.id) !== undefined; if (deleted) await table.delete(request.id); return { deleted } }) }

  private registerTools(): void {
    this.ctx.tools.register(defineTool({ name: 'deep_research_start', description: 'Create a durable Deep Research project with explicit sub-questions and success criteria.', parameters: { title: { type: 'string' }, question: { type: 'string', required: true }, goal: { type: 'string' }, constraints: { type: 'string' }, seedText: { type: 'string' }, depth: { type: 'string', required: true, enum: ['quick', 'standard', 'deep'] }, questions: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true }, criteria: { type: 'array', required: true, items: { type: 'string' } }, dependsOn: { type: 'array', items: { type: 'number' } } } } } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.start(args)) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Plan deep research', rawInput: args.question }) }))
    this.ctx.tools.register(defineTool({ name: 'deep_research_list', description: 'List durable research projects before resuming or starting duplicate work.', parameters: { query: { type: 'string' }, phase: { type: 'string', enum: ['planning', 'awaiting_plan_confirm', 'investigating', 'ready_for_report', 'incomplete', 'writing', 'done', 'failed', 'aborted'] } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: args => Promise.resolve({ text: this.list(args).projects.map(projectSummary).join('\n\n') || 'No research projects matched.' }), presentCall: args => ({ card: 'generic', kind: 'search', title: 'List research projects', rawInput: args.query ?? args.phase }) }))
    this.ctx.tools.register(defineTool({ name: 'deep_research_confirm_plan', description: 'Confirm a reviewed project plan before gathering evidence.', parameters: { id: { type: 'string', required: true } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.confirmPlan({ id: ResearchId(args.id) })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Confirm research plan', rawInput: args.id }) }))
    this.ctx.tools.register(defineTool({ name: 'deep_research_add_evidence', description: 'Attach a source-backed claim to one planned sub-question and its criteria.', parameters: { id: { type: 'string', required: true }, questionId: { type: 'string', required: true }, criterionIds: { type: 'array', items: { type: 'string' } }, source: { type: 'string', required: true }, url: { type: 'string' }, snippet: { type: 'string' }, claim: { type: 'string', required: true }, confidence: { type: 'string', required: true, enum: ['low', 'medium', 'high'] } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.addEvidence({ ...args, id: ResearchId(args.id), questionId: ResearchQuestionId(args.questionId) })) }), presentCall: args => ({ card: 'generic', kind: 'search', title: 'Add research evidence', rawInput: args.source }) }))
    this.ctx.tools.register(defineTool({ name: 'deep_research_update_coverage', description: 'Record reviewed question and success-criterion coverage.', parameters: { id: { type: 'string', required: true }, questionId: { type: 'string', required: true }, status: { type: 'string', required: true, enum: ['pending', 'running', 'covered', 'partial', 'blocked', 'failed'] } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.updateQuestion({ id: ResearchId(args.id), questionId: ResearchQuestionId(args.questionId), status: args.status })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update research coverage', rawInput: args.questionId }) }))
    this.ctx.tools.register(defineTool({ name: 'deep_research_complete', description: 'Save the evidence-based report, conclusions, and limitations.', parameters: { id: { type: 'string', required: true }, report: { type: 'string', required: true }, conclusions: { type: 'array', items: { type: 'string' } }, limitations: { type: 'array', items: { type: 'string' } }, partial: { type: 'boolean' } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.complete({ ...args, id: ResearchId(args.id) })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Complete deep research', rawInput: args.id }) }))
  }

  private buildQuestions(input: ResearchStartRequest['questions']): ResearchQuestion[] {
    if (input.length === 0) throw new TypeError('deepresearch: plan must contain at least one question'); if (input.length > this.config.maxQuestions) throw new RangeError(`deepresearch: question limit ${this.config.maxQuestions} reached`)
    const ids = input.map(() => ResearchQuestionId(`rq-${randomUUID()}`))
    return input.map((item, index) => { if (item.criteria.length === 0) throw new TypeError(`deepresearch: questions[${index}] requires criteria`); if (item.criteria.length > this.config.maxCriteriaPerQuestion) throw new RangeError(`deepresearch: criterion limit ${this.config.maxCriteriaPerQuestion} reached`); return { id: ids[index] as ResearchQuestionId, text: requiredText(item.text, `questions[${index}].text`), dependsOn: (item.dependsOn ?? []).map(dep => { const id = ids[dep]; if (id === undefined || dep >= index) throw new TypeError(`deepresearch: questions[${index}] has invalid dependency ${dep}`); return id }), status: 'pending', criteria: item.criteria.map((text, criterionIndex) => ({ id: `c${index + 1}.${criterionIndex + 1}`, text: requiredText(text, `questions[${index}].criteria[${criterionIndex}]`), status: 'missing', summary: '', gap: '' })) } })
  }

  private update(id: ResearchId, mutate: (project: ResearchProject) => ResearchProject): Promise<ResearchProject> { return this.enqueue(async () => { const table = this.requireTable(); const current = table.get(id); if (current === undefined) throw new Error(`deepresearch: project ${id} not found`); const project = snapshot({ ...mutate(snapshot(current)), updatedAt: Math.max(Date.now(), current.updatedAt + 1) }); await table.put(id, project); return snapshot(project) }) }
  private enqueue<T>(operation: () => Promise<T>): Promise<T> { const result = this.mutationTail.then(operation); this.mutationTail = result.then(() => undefined, () => undefined); return result }
  private requireTable(): KvTable<ResearchId, ResearchProject> { if (this.table === undefined) throw new Error('deepresearch: durable domain is not initialized'); return this.table }
}

function budgetFor(depth: ResearchProject['depth']): ResearchProject['budget'] { const limits = depth === 'quick' ? [8, 6] : depth === 'deep' ? [30, 24] : [18, 14]; return { maxSearches: limits[0] as number, maxFetches: limits[1] as number, searchesUsed: 0, fetchesUsed: 0 } }
function requiredText(value: string, field: string): string { const text = value.trim(); if (text === '') throw new TypeError(`deepresearch: ${field} must not be blank`); return text }
function optionalText(value: string | undefined): string { return value?.trim() ?? '' }
function normalizeList(values: readonly string[]): string[] { return [...new Set(values.map(value => value.trim()).filter(Boolean))] }
function researchText(project: ResearchProject): string { return [project.title, project.question, project.goal, project.constraints, project.seedText, project.report ?? '', ...project.questions.flatMap(question => [question.text, ...question.criteria.flatMap(criterion => [criterion.text, criterion.summary, criterion.gap])]), ...project.evidence.flatMap(evidence => [evidence.source, evidence.url ?? '', evidence.claim, evidence.snippet])].join('\n').toLocaleLowerCase() }
function projectSummary(project: ResearchProject): string { return `${project.title} (${project.id})\nPhase: ${project.phase}; questions: ${project.questions.length}; evidence: ${project.evidence.length}\n${project.question}` }
function snapshot(project: ResearchProject): ResearchProject { return Object.freeze({ ...project, questions: project.questions.map(question => Object.freeze({ ...question, dependsOn: [...question.dependsOn], criteria: question.criteria.map(criterion => Object.freeze({ ...criterion })) })), evidence: project.evidence.map(item => Object.freeze({ ...item, criterionIds: [...item.criterionIds] })), conclusions: [...project.conclusions], limitations: [...project.limitations], budget: Object.freeze({ ...project.budget }) }) }

export default DeepResearchService
