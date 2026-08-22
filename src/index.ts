/**
 * Evidence-first Deep Research workspace over existing Web and subagent Tools.
 * @module @deepseek-ai/dsh-deepresearch
 */

import { randomUUID } from 'node:crypto'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { AgentHandle } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-default-model'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
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
  /** Whether project creation and confirmation start private DSH Agents. */
  readonly runnerEnabled: boolean
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

interface ActiveResearchRun {
  readonly phase: RunnerPhase
  readonly controller: AbortController
  handle?: AgentHandle
  promise?: Promise<void>
}

type RunnerPhase = 'planning' | 'investigating'

/** Durable Codemini-style Deep Research project service. */
export class DeepResearchService extends TypertRemoteService {
  static inject = ['storageDomain', 'tools', 'systemPrompt', 'agents', 'agentDefaultModel']
  static Config: s<Config> = s.object({
    runnerEnabled: s.boolean().required(),
    maxProjects: s.number().step(1).min(1).required(), maxQuestions: s.number().step(1).min(1).required(),
    maxCriteriaPerQuestion: s.number().step(1).min(1).required(), maxEvidencePerProject: s.number().step(1).min(1).required(), maxReportChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<ResearchId, ResearchProject>
  private mutationTail: Promise<void> = Promise.resolve()
  private readonly activeRuns = new Map<ResearchId, ActiveResearchRun>()

  /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
  constructor(ctx: Context, private readonly config: Config) { super(ctx, 'deepResearch') }

  /** Open storage and install runner teardown. */
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'deepresearch.domainClose')
    this.table = domain.table('projects')
    this.ctx.effect(() => async () => {
      const runs = [...this.activeRuns.values()]
      for (const run of runs) {
        run.controller.abort()
        run.handle?.agent.cancel({ kind: 'disposed' })
      }
      await Promise.allSettled(runs.map(run => run.promise))
    }, 'deepresearch.runnerDrain')
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
      const questions = request.questions.length === 0 ? [] : this.buildQuestions(request.questions); const now = Date.now(); const id = ResearchId(`research-${randomUUID()}`)
      const project = snapshot({ id, title: optionalText(request.title) || `🔬 ${requiredText(request.question, 'question').slice(0, 64)}`, question: requiredText(request.question, 'question'), goal: optionalText(request.goal), constraints: optionalText(request.constraints), seedText: optionalText(request.seedText), depth: request.depth, phase: this.config.runnerEnabled ? 'planning' : 'awaiting_plan_confirm', planConfirmed: false, questions, evidence: [], conclusions: [], limitations: [], report: null, budget: budgetFor(request.depth), createdAt: now, updatedAt: now })
      await table.put(id, project)
      if (this.config.runnerEnabled) this.launch(id, 'planning')
      return snapshot(project)
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
  async confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject> {
    const project = await this.update(request.id, current => {
      if (current.questions.length === 0) throw new Error(`deepresearch: project ${current.id} has no generated plan`)
      return { ...current, planConfirmed: true, phase: 'investigating' }
    })
    if (this.config.runnerEnabled) this.launch(request.id, 'investigating')
    return project
  }

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
      return { ...project, phase: 'investigating', evidence: [...project.evidence, evidence] }
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
      const current = project.questions[index] as ResearchQuestion; const questions = [...project.questions]
      const inferredCriterionStatus = request.status === 'covered' ? 'covered' : request.status === 'partial' ? 'partial' : request.status === 'blocked' || request.status === 'failed' ? 'blocked' : undefined
      const criteria = request.criteria ?? (inferredCriterionStatus === undefined ? current.criteria : current.criteria.map(criterion => ({ ...criterion, status: inferredCriterionStatus })))
      questions[index] = { ...current, status: request.status, criteria }
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
  fail(request: ResearchFailRequest): Promise<ResearchProject> {
    this.stopRun(request.id)
    return this.update(request.id, project => ({ ...project, phase: request.aborted === true ? 'aborted' : 'failed', limitations: normalizeList([...project.limitations, requiredText(request.reason, 'reason')]) }))
  }

  /**
   * Delete a project; absence is a stable successful outcome.
   * @param request - project identity to delete.
   * @returns whether the project existed.
   */
  @Remote('delete')
  delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult> { this.stopRun(request.id); return this.enqueue(async () => { const table = this.requireTable(); const deleted = table.get(request.id) !== undefined; if (deleted) await table.delete(request.id); return { deleted } }) }

  private registerRunnerTools(ctx: Context): void {
    ctx.tools.register(defineTool({ name: 'deep_research_get', description: 'Read the exact Deep Research project, including question and criterion ids, evidence, and budgets.', parameters: { id: { type: 'string', required: true } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: args => Promise.resolve({ text: JSON.stringify(this.get({ id: ResearchId(args.id) })) }), presentCall: args => ({ card: 'generic', kind: 'search', title: 'Read research state', rawInput: args.id }) }))
    ctx.tools.register(defineTool({ name: 'deep_research_submit_plan', description: 'Submit the generated plan for user review. This ends the planning run.', parameters: { id: { type: 'string', required: true }, goal: { type: 'string', required: true }, constraints: { type: 'string', required: true }, depth: { type: 'string', required: true, enum: ['quick', 'standard', 'deep'] }, questions: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true }, criteria: { type: 'array', required: true, items: { type: 'string' } }, dependsOn: { type: 'array', items: { type: 'number' } } } } } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.updatePlan({ ...args, id: ResearchId(args.id) })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Submit research plan', rawInput: args.id }) }))
    ctx.tools.register(defineTool({ name: 'deep_research_add_evidence', description: 'Attach a source-backed claim to one planned sub-question and its criteria.', parameters: { id: { type: 'string', required: true }, questionId: { type: 'string', required: true }, criterionIds: { type: 'array', items: { type: 'string' } }, source: { type: 'string', required: true }, url: { type: 'string' }, snippet: { type: 'string' }, claim: { type: 'string', required: true }, confidence: { type: 'string', required: true, enum: ['low', 'medium', 'high'] } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.addEvidence({ ...args, id: ResearchId(args.id), questionId: ResearchQuestionId(args.questionId) })) }), presentCall: args => ({ card: 'generic', kind: 'search', title: 'Add research evidence', rawInput: args.source }) }))
    ctx.tools.register(defineTool({ name: 'deep_research_update_coverage', description: 'Record reviewed question and success-criterion coverage.', parameters: { id: { type: 'string', required: true }, questionId: { type: 'string', required: true }, status: { type: 'string', required: true, enum: ['pending', 'running', 'covered', 'partial', 'blocked', 'failed'] } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.updateQuestion({ id: ResearchId(args.id), questionId: ResearchQuestionId(args.questionId), status: args.status })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Update research coverage', rawInput: args.questionId }) }))
    ctx.tools.register(defineTool({ name: 'deep_research_complete', description: 'Save the evidence-based report, conclusions, and limitations.', parameters: { id: { type: 'string', required: true }, report: { type: 'string', required: true }, conclusions: { type: 'array', items: { type: 'string' } }, limitations: { type: 'array', items: { type: 'string' } }, partial: { type: 'boolean' } }, output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] }, execute: async args => ({ text: projectSummary(await this.complete({ ...args, id: ResearchId(args.id) })) }), presentCall: args => ({ card: 'generic', kind: 'edit', title: 'Complete deep research', rawInput: args.id }) }))
  }

  private launch(id: ResearchId, phase: RunnerPhase): void {
    const active = this.activeRuns.get(id)
    if (active !== undefined) {
      if (active.phase !== phase) void active.promise?.then(() => { this.launch(id, phase) })
      return
    }
    const run: ActiveResearchRun = { phase, controller: new AbortController() }
    this.activeRuns.set(id, run)
    run.promise = this.runProject(id, phase, run).catch(async (cause: unknown) => {
      if (run.controller.signal.aborted || this.requireTable().get(id) === undefined) return
      const reason = cause instanceof Error ? cause.message : String(cause)
      await this.update(id, project => ({ ...project, phase: 'failed', limitations: normalizeList([...project.limitations, `Runner failed: ${reason}`]) }))
    }).finally(async () => {
      this.activeRuns.delete(id)
      if (run.handle !== undefined) await run.handle.dispose()
    })
  }

  private async runProject(id: ResearchId, phase: RunnerPhase, run: ActiveResearchRun): Promise<void> {
    const selection = this.ctx.agentDefaultModel.currentSelection()
    const inherited = new Set(this.ctx.tools.schemas().map(schema => schema.name))
    const allowed = ['web_search', 'web_fetch', 'subagent'].filter(name => inherited.has(name))
    if (phase === 'investigating' && !allowed.includes('web_search')) throw new Error('web_search is not available in this profile')
    const handle = await this.ctx.agents.create({
      sessionId: SessionId(`deepresearch-run-${randomUUID()}`),
      meta: { origin: 'subagent', delegationDepth: 1 },
      agentOptions: { provider: selection.provider, model: selection.model },
      signal: run.controller.signal,
      setup: (agentCtx) => {
        agentCtx.tools.restrict({ allow: allowed })
        this.registerRunnerTools(agentCtx)
        agentCtx.systemPrompt.section({
          name: 'deepresearch:runner',
          order: 10_000,
          text: runnerSystemPrompt(phase),
        })
        agentCtx.on('tools/post-execute', async (exec, result, next) => {
          if (!result.isError && (exec.name === 'web_search' || exec.name === 'web_fetch')) {
            await this.bumpBudget(id, exec.name)
          }
          return next()
        })
      },
    })
    run.handle = handle
    if (run.controller.signal.aborted) return
    handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: runnerPrompt(id, phase) }], source: { kind: 'user' } }))
    await handle.agent.whenIdle()
    if (run.controller.signal.aborted) return
    const project = this.get({ id })
    if (project === null) return
    if (phase === 'planning' && project.phase === 'planning') throw new Error('the planning agent stopped before submitting a plan')
    if (phase === 'investigating' && ['investigating', 'ready_for_report', 'writing'].includes(project.phase)) throw new Error('the research agent stopped before saving a report')
  }

  private stopRun(id: ResearchId): void {
    const run = this.activeRuns.get(id)
    if (run === undefined) return
    run.controller.abort()
    run.handle?.agent.cancel({ kind: 'user' })
  }

  private async bumpBudget(id: ResearchId, tool: 'web_search' | 'web_fetch'): Promise<void> {
    await this.update(id, project => ({
      ...project,
      budget: tool === 'web_search'
        ? { ...project.budget, searchesUsed: Math.min(project.budget.maxSearches, project.budget.searchesUsed + 1) }
        : { ...project.budget, fetchesUsed: Math.min(project.budget.maxFetches, project.budget.fetchesUsed + 1) },
    }))
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
function runnerSystemPrompt(phase: RunnerPhase): string {
  return phase === 'planning'
    ? 'You are the planning stage of a private Deep Research run. Work only on the project id in the user message. Read its exact state, create a concise evidence-oriented plan, and submit it with deep_research_submit_plan. Do not investigate, write a report, ask the user a question, or emit a user-facing answer.'
    : 'You are the private Deep Research runner. Work only on the project id in the user message. Read exact state first. Investigate each sub-question with web_search and web_fetch, save source-backed claims immediately, and update coverage after reviewing evidence. Respect dependencies and budgets. When every question is covered, partial, or blocked, write and save one cited report with explicit conclusions and limitations. Never invent a source, claim, coverage result, or completion. Do not ask the user a question or emit a user-facing answer.'
}
function runnerPrompt(id: ResearchId, phase: RunnerPhase): string {
  return phase === 'planning'
    ? `Plan Deep Research project ${id}. Call deep_research_get first, then call deep_research_submit_plan exactly once with 3-6 focused sub-questions, measurable success criteria, and valid zero-based dependencies.`
    : `Run Deep Research project ${id} to completion inside this private research session. Call deep_research_get first. For each question, mark it running, gather and fetch independent sources, save evidence with exact question and criterion ids, then mark coverage. Finally call deep_research_complete with a cited Markdown report, conclusions, limitations, and partial=true only when evidence is insufficient.`
}
function snapshot(project: ResearchProject): ResearchProject { return Object.freeze({ ...project, questions: project.questions.map(question => Object.freeze({ ...question, dependsOn: [...question.dependsOn], criteria: question.criteria.map(criterion => Object.freeze({ ...criterion })) })), evidence: project.evidence.map(item => Object.freeze({ ...item, criterionIds: [...item.criterionIds] })), conclusions: [...project.conclusions], limitations: [...project.limitations], budget: Object.freeze({ ...project.budget }) }) }

export default DeepResearchService
