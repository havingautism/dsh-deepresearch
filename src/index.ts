/**
 * Codemini-aligned Deep Research: planning Lead, serial/parallel Scouts, Evaluator, Writer.
 * @module @deepseek-ai/dsh-deepresearch
 */

import { randomUUID } from 'node:crypto'
import { resolve } from 'node:path'
import { Context, Service } from '@deepseek-ai/cordis'
import s from '@deepseek-ai/schemastery'
import type { AgentHandle } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-agent-default-model'
import type {} from '@deepseek-ai/dsh-agent-presets'
import { createUserMessage } from '@deepseek-ai/dsh-llm'
import { SessionId } from '@deepseek-ai/dsh-session'
import type {} from '@deepseek-ai/dsh-storage'
import type { KvTable } from '@deepseek-ai/dsh-storage-domain'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { cleanupCriterionArtifacts, cleanupProjectArtifacts, persistArtifact, readArtifact } from './artifacts.ts'
import { assertPlanFitsDepth, budgetForProject, countCriteria, isOversizedPlanError, MAX_PARALLEL_SCOUTS, MAX_PLAN_REJECTS, planLimits, planResearchBudget, resolveSubmittedDepth, TOOLS_PER_CRITERION } from './budget.ts'
import {
  appendToolBudgetNote, buildResearchWritingPack, buildScoutHandoff, collectDependencyContext, collectLimitations,
  criterionStatusFromReview, deriveQuestionGaps, emptyProgress, emptyScoutProgress, gateCandidatesByUrl,
  indexFetchResult, indexSearchResult, isAcceptedVerdict, mergeScoutProgress, normalizeQuery, normalizeReview,
  normalizeSubmittedCandidates, normalizeUrl, parseCandidatesFromText, parseReviewFromText, pushProgressTool, uniqueSources,
  questionStatusFromCoverage, readableRoleDraft, selectReadyWaveBatch, type Candidate, type CriterionReview, type IndexedUrl,
} from './investigation.ts'
import {
  evaluatorNudgePrompt, evaluatorSystemPrompt, evaluatorUserPrompt, planningNudgePrompt, planningSystemPrompt,
  planningUserPrompt, scoutNudgePrompt, scoutSystemPrompt, scoutUserPrompt, writerNudgePrompt, writerSystemPrompt,
  writerUserPrompt,
} from './prompts.ts'
import { importJsonProjectsIfEmpty, importLegacySqliteProjectsIfEmpty, legacyDeepResearchSqlitePath, migrateDeepResearchUnitFile, resolveDeepResearchUnitPath } from './migrate.ts'
import { ensurePluginPlatform, sqlitePathFor } from './platform.ts'
import { deepResearchDomainSpec } from './spec.ts'
import { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts'
import type {
  ResearchCompleteRequest, ResearchConfirmRequest, ResearchCriterion, ResearchDeleteRequest, ResearchDeleteResult,
  ResearchEvidence, ResearchEvidenceRequest, ResearchFailRequest, ResearchGetRequest, ResearchListRequest,
  ResearchListResult, ResearchPlanUpdateRequest, ResearchProject, ResearchQuestion,
  ResearchQuestionUpdateRequest, ResearchResumeRequest, ResearchScoutProgress, ResearchStartRequest,
  ResearchWriteReportRequest,
} from './types.ts'

export type * from './types.ts'
export { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts'
export { deepResearchDomainSpec, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema } from './spec.ts'
export { defaultDeepResearchSqlitePath, defaultDeepResearchUnitPath, defaultSharedSqlitePath, importJsonProjectsIfEmpty, importLegacySqliteProjectsIfEmpty, migrateDeepResearchUnitFile, resolveDeepResearchUnitPath } from './migrate.ts'
export { assertPlanFitsDepth, inferResearchPlanDepth, planResearchBudget } from './budget.ts'
export {
  buildResearchWritingPack, gateCandidatesByUrl, normalizeQuery, normalizeSubmittedCandidates,
  normalizeUrl, parseCandidatesFromText, selectReadyWaveBatch,
} from './investigation.ts'

/** Required project, evidence, and report limits. */
export interface Config {
  readonly runnerEnabled: boolean
  readonly runnerCwd: string
  readonly maxProjects: number
  readonly maxQuestions: number
  readonly maxCriteriaPerQuestion: number
  readonly maxEvidencePerProject: number
  readonly maxReportChars: number
  /** Override JSON storages directory; defaults to `DSH_HOME/storages`. */
  readonly storageRoot?: string
}

interface WebLike {
  search(request: { query: string; maxResults?: number }, signal?: AbortSignal): Promise<{ content?: string; sources: ReadonlyArray<{ url: string; title?: string; snippet?: string }> }>
  fetch(request: { url: string }, signal?: AbortSignal): Promise<{ url: string; statusCode: number; body: { kind: string; content: string } }>
}

declare module '@deepseek-ai/cordis' { interface Context { deepResearch: DeepResearchService } }

const TEXT_OUTPUT = { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true } } } as const

interface ActiveResearchRun {
  readonly phase: RunnerPhase
  readonly controller: AbortController
  readonly handles: AgentHandle[]
  planRejects: number
  promise?: Promise<void>
}

type RunnerPhase = 'planning' | 'investigating' | 'writing'

/** Durable Codemini-style Deep Research project service. */
export class DeepResearchService extends TypertRemoteService {
  static inject = ['storage', 'storageDomain', 'tools', 'systemPrompt', 'agents', 'agentDefaultModel', 'agentPresets', 'web']
  static Config: s<Config> = s.object({
    runnerEnabled: s.boolean().required(),
    runnerCwd: s.string().default(process.cwd()),
    storageRoot: s.string(),
    maxProjects: s.number().step(1).min(1).required(), maxQuestions: s.number().step(1).min(1).required(),
    maxCriteriaPerQuestion: s.number().step(1).min(1).required(), maxEvidencePerProject: s.number().step(1).min(1).required(), maxReportChars: s.number().step(1).min(1).required(),
  })

  private table?: KvTable<ResearchId, ResearchProject>
  private mutationTail: Promise<void> = Promise.resolve()
  private readonly activeRuns = new Map<ResearchId, ActiveResearchRun>()

  /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
  constructor(ctx: Context, private readonly config: Config) { super(ctx, 'deepResearch') }

  protected async [Service.init](): Promise<void> {
    const sqlitePath = sqlitePathFor(this.config)
    await ensurePluginPlatform(this.ctx, {
      domain: 'deepresearch',
      sqlitePath,
    })
    const jsonPath = resolveDeepResearchUnitPath(this.config.storageRoot)
    await migrateDeepResearchUnitFile(jsonPath)
    const domain = await this.ctx.storageDomain.open(deepResearchDomainSpec)
    this.ctx.effect(() => () => domain.close(), 'deepresearch.domainClose')
    this.table = domain.table('projects')
    await importLegacySqliteProjectsIfEmpty(legacyDeepResearchSqlitePath(sqlitePath), sqlitePath, this.table)
    await importJsonProjectsIfEmpty(jsonPath, this.table)
    if (this.config.runnerEnabled) {
      for (const [id, project] of this.table.entries()) {
        if (project.runState === 'paused') continue
        if (project.phase === 'planning') this.launch(id, 'planning')
        else if (project.phase === 'investigating') this.launch(id, 'investigating')
        else if (project.phase === 'writing') this.launch(id, 'writing')
      }
    }
    this.ctx.effect(() => async () => {
      const runs = [...this.activeRuns.values()]
      for (const run of runs) {
        run.controller.abort()
        for (const handle of run.handles) handle.agent.cancel({ kind: 'disposed' })
      }
      await Promise.allSettled(runs.map(run => run.promise))
    }, 'deepresearch.runnerDrain')
  }

  @Remote('list')
  list(request: ResearchListRequest): ResearchListResult {
    const query = request.query?.trim().toLocaleLowerCase()
    return { projects: [...this.requireTable().entries()].map(([, project]) => snapshot(project)).filter(project => request.phase === undefined || project.phase === request.phase).filter(project => query === undefined || query === '' || researchText(project).includes(query)).sort((left, right) => right.updatedAt - left.updatedAt) }
  }

  @Remote('get')
  get(request: ResearchGetRequest): ResearchProject | null { const project = this.requireTable().get(request.id); return project === undefined ? null : snapshot(project) }

  @Remote('start')
  start(request: ResearchStartRequest): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable(); if (table.size >= this.config.maxProjects) throw new RangeError(`deepresearch: project limit ${this.config.maxProjects} reached`)
      const depth = resolveSubmittedDepth(request.depth, request.question, request.goal)
      const questions = request.questions.length === 0 ? [] : this.buildQuestions(request.questions, depth)
      const now = Date.now(); const id = ResearchId(`research-${randomUUID()}`)
      const project = snapshot({
        id, title: optionalText(request.title) || `🔬 ${requiredText(request.question, 'question').slice(0, 64)}`,
        question: requiredText(request.question, 'question'), goal: optionalText(request.goal), constraints: optionalText(request.constraints),
        seedText: optionalText(request.seedText), depth, phase: this.config.runnerEnabled ? 'planning' : 'awaiting_plan_confirm',
        runState: this.config.runnerEnabled ? 'running' : 'idle', planConfirmed: false,
        questions, evidence: [], conclusions: [], limitations: [], report: null,
        budget: planResearchBudget(countCriteria(questions)), progress: emptyProgress(), createdAt: now, updatedAt: now,
      })
      await table.put(id, project)
      if (this.config.runnerEnabled) {
        this.emitProgress(project)
        this.launch(id, 'planning')
      }
      return snapshot(project)
    })
  }

  @Remote('updatePlan')
  updatePlan(request: ResearchPlanUpdateRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      if (project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is confirmed`)
      const depth = resolveSubmittedDepth(request.depth, project.question, request.goal)
      const questions = this.buildQuestions(request.questions, depth)
      return { ...project, goal: request.goal.trim(), constraints: request.constraints.trim(), depth, questions, budget: planResearchBudget(countCriteria(questions), project.budget), phase: 'awaiting_plan_confirm' }
    })
  }

  @Remote('confirmPlan')
  async confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject> {
    const project = await this.update(request.id, current => {
      if (current.questions.length === 0) throw new Error(`deepresearch: project ${current.id} has no generated plan`)
      return { ...current, planConfirmed: true, phase: 'investigating', runState: 'running', budget: budgetForProject(current), progress: seedInvestigationProgress(current) }
    })
    if (this.config.runnerEnabled) this.launch(request.id, 'investigating')
    return project
  }

  @Remote('addEvidence')
  addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      if (!project.planConfirmed) throw new Error(`deepresearch: project ${project.id} plan is not confirmed`)
      if (project.evidence.length >= this.config.maxEvidencePerProject) throw new RangeError(`deepresearch: evidence limit ${this.config.maxEvidencePerProject} reached`)
      const question = project.questions.find(item => item.id === request.questionId); if (question === undefined) throw new Error(`deepresearch: question ${request.questionId} not found`)
      const criteria = new Set(question.criteria.map(item => item.id)); for (const id of request.criterionIds ?? []) if (!criteria.has(id)) throw new Error(`deepresearch: criterion ${id} not found`)
      const sources = uniqueSources((request.sources ?? []).map(source => source.artifactId
        ? { url: optionalText(source.url), snippet: optionalText(source.snippet), artifactId: source.artifactId }
        : { url: optionalText(source.url), snippet: optionalText(source.snippet) }))
      const url = sources[0]?.url || optionalText(request.url) || null
      const snippet = sources[0]?.snippet || optionalText(request.snippet)
      const evidence: ResearchEvidence = {
        id: ResearchEvidenceId(`evidence-${randomUUID()}`), questionId: request.questionId, criterionIds: [...(request.criterionIds ?? [])],
        source: requiredText(request.source, 'source'), url, snippet, sources: sources.length > 0 ? sources : (url || snippet ? [{ url: url ?? '', snippet }] : []),
        claim: requiredText(request.claim, 'claim'), confidence: request.confidence, status: request.status ?? 'accepted', createdAt: Date.now(),
      }
      return { ...project, phase: 'investigating', evidence: [...project.evidence, evidence] }
    })
  }

  @Remote('updateQuestion')
  updateQuestion(request: ResearchQuestionUpdateRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      const index = project.questions.findIndex(item => item.id === request.questionId); if (index < 0) throw new Error(`deepresearch: question ${request.questionId} not found`)
      const current = project.questions[index] as ResearchQuestion; const questions = [...project.questions]
      const inferredCriterionStatus = request.status === 'covered' ? 'covered' : request.status === 'partial' ? 'partial' : request.status === 'blocked' || request.status === 'failed' ? 'blocked' : undefined
      const criteria = request.criteria ?? (inferredCriterionStatus === undefined ? current.criteria : current.criteria.map(criterion => ({ ...criterion, status: inferredCriterionStatus })))
      questions[index] = { ...current, status: request.status, criteria, gaps: deriveQuestionGaps(criteria) }
      const settled = questions.every(question => ['covered', 'partial', 'blocked'].includes(question.status))
      return { ...project, questions, phase: settled ? 'ready_for_report' : 'investigating' }
    })
  }

  @Remote('complete')
  complete(request: ResearchCompleteRequest): Promise<ResearchProject> {
    return this.update(request.id, project => {
      const report = requiredText(request.report, 'report'); if (report.length > this.config.maxReportChars) throw new RangeError(`deepresearch: report exceeds ${this.config.maxReportChars} characters`)
      const limitations = normalizeList(request.limitations ?? collectLimitations(project))
      void cleanupProjectArtifacts(project.id)
      return { ...project, phase: 'done', runState: 'idle', report, conclusions: normalizeList(request.conclusions ?? project.conclusions), limitations, progress: emptyProgress() }
    })
  }

  @Remote('fail')
  fail(request: ResearchFailRequest): Promise<ResearchProject> {
    this.stopRun(request.id)
    if (request.aborted === true) return this.markPaused(request.id)
    void cleanupProjectArtifacts(request.id)
    return this.update(request.id, project => ({ ...project, phase: 'failed', runState: 'idle', limitations: normalizeList([...project.limitations, requiredText(request.reason, 'reason')]), progress: emptyProgress() }))
  }

  @Remote('resume')
  async resume(request: ResearchResumeRequest): Promise<ResearchProject> {
    const phase = resumeRunnerPhase(this.require(request.id))
    const project = await this.update(request.id, current => ({
      ...current,
      runState: 'running',
      phase: resumeProjectPhase(current, phase),
    }))
    if (this.config.runnerEnabled) this.launch(request.id, phase)
    return project
  }

  @Remote('writeReport')
  async writeReport(request: ResearchWriteReportRequest): Promise<ResearchProject> {
    if (!this.require(request.id).planConfirmed) throw new Error(`deepresearch: project ${request.id} plan is not confirmed`)
    this.stopRun(request.id)
    const project = await this.update(request.id, current => ({
      ...current,
      phase: 'writing',
      runState: 'running',
      limitations: collectLimitations(current),
    }))
    if (this.config.runnerEnabled) this.launch(request.id, 'writing')
    return project
  }

  @Remote('delete')
  delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult> {
    this.stopRun(request.id)
    void cleanupProjectArtifacts(request.id)
    return this.enqueue(async () => { const table = this.requireTable(); const deleted = table.get(request.id) !== undefined; if (deleted) await table.delete(request.id); return { deleted } })
  }

  private launch(id: ResearchId, phase: RunnerPhase): void {
    const active = this.activeRuns.get(id)
    if (active !== undefined) {
      if (active.phase !== phase) void active.promise?.then(() => { this.launch(id, phase) })
      return
    }
    const run: ActiveResearchRun = { phase, controller: new AbortController(), handles: [], planRejects: 0 }
    this.activeRuns.set(id, run)
    run.promise = (phase === 'planning' ? this.runPlanning(id, run) : phase === 'writing' ? this.runWritingPhase(id, run) : this.runInvestigation(id, run)).catch(async (cause: unknown) => {
      if (run.controller.signal.aborted || this.requireTable().get(id) === undefined) return
      const reason = cause instanceof Error ? cause.message : String(cause)
      await this.update(id, project => ({ ...project, phase: 'failed', runState: 'idle', limitations: normalizeList([...project.limitations, `Runner failed: ${reason}`]) }))
    }).finally(async () => {
      this.activeRuns.delete(id)
      await Promise.allSettled(run.handles.map(handle => handle.dispose()))
    })
  }

  private async runPlanning(id: ResearchId, run: ActiveResearchRun): Promise<void> {
    const project = this.require(id)
    let submitted = false
    await this.spawnRole(id, run, {
      tools: ['deep_research_submit_plan'],
      system: planningSystemPrompt(project, planLimits(project.depth, this.config)),
      user: planningUserPrompt(project),
      nudge: planningNudgePrompt(),
      register: ctx => {
        ctx.tools.register(defineTool({
          name: 'deep_research_submit_plan',
          description: 'Submit the generated plan for user review. This ends the planning run. Oversized plans are rejected — shrink and call again.',
          parameters: { goal: { type: 'string', required: true }, constraints: { type: 'string' }, depth: { type: 'string', required: true, enum: ['quick', 'standard', 'deep'] }, questions: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: { text: { type: 'string', required: true }, criteria: { type: 'array', required: true, items: { type: 'string' } }, dependsOn: { type: 'array', items: { type: 'number' } } } } } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            try {
              const current = this.require(id)
              const constraints = String(args.constraints ?? '').trim() || current.constraints
              const updated = await this.updatePlan({ id, goal: String(args.goal ?? ''), constraints, depth: args.depth as ResearchStartRequest['depth'], questions: args.questions as ResearchStartRequest['questions'] })
              run.planRejects = 0
              submitted = true
              return { text: JSON.stringify({ ok: true, phase: updated.phase, questionCount: updated.questions.length }) }
            } catch (error) {
              if (!isOversizedPlanError(error)) throw error
              run.planRejects += 1
              if (run.planRejects >= MAX_PLAN_REJECTS) throw new Error(`${error instanceof Error ? error.message : String(error)} Gave up after ${MAX_PLAN_REJECTS} oversized submissions.`)
              return { text: JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }) }
            }
          },
          presentCall: () => presentGeneric('edit', 'Submit research plan', id),
        }))
      },
      done: () => submitted,
    })
    if (run.controller.signal.aborted) return
    const latest = this.get({ id })
    if (latest !== null && latest.phase === 'planning') throw new Error('the planning agent stopped before submitting a plan')
  }

  private async runInvestigation(id: ResearchId, run: ActiveResearchRun): Promise<void> {
    this.requireWeb()
    while (!run.controller.signal.aborted) {
      const project = this.require(id)
      const { ready, waiting } = selectReadyWaveBatch(project.questions, MAX_PARALLEL_SCOUTS)
      if (ready.length === 0) break
      let progress = project.progress
      for (const item of waiting) {
        progress = mergeScoutProgress(progress, emptyScoutProgress(item.question.id, { role: 'waiting', status: 'waiting', waitingOn: item.waitingOn, activity: 'Waiting on upstream sub-questions.' }))
      }
      await this.update(id, current => ({ ...current, progress }))
      const results = await Promise.allSettled(ready.map(question => this.runScoutForQuestion(id, run, question.id)))
      const rejected = results.find((item): item is PromiseRejectedResult => item.status === 'rejected')
      if (rejected !== undefined && !run.controller.signal.aborted) throw rejected.reason
    }
    if (run.controller.signal.aborted) return
    await this.runWritingPhase(id, run)
  }

  private async runWritingPhase(id: ResearchId, run: ActiveResearchRun): Promise<void> {
    if (run.controller.signal.aborted) return
    const settled = this.require(id)
    const accepted = settled.evidence.filter(item => item.status === 'accepted')
    await this.update(id, current => ({
      ...current,
      phase: 'writing',
      runState: current.runState === 'paused' ? 'paused' : 'running',
      limitations: collectLimitations(current),
      progress: mergeScoutProgress(current.progress, emptyScoutProgress(current.questions[0]?.id ?? ResearchQuestionId('writing'), { role: 'writing', status: 'running', activity: 'Writing the report from the verified pack.' })),
    }))
    if (run.controller.signal.aborted) return
    await this.runWriting(id, run)
    if (run.controller.signal.aborted) return
    void cleanupProjectArtifacts(id)
    const finished = this.require(id)
    if (['investigating', 'ready_for_report', 'writing'].includes(finished.phase) && accepted.length === 0) {
      await this.update(id, current => ({ ...current, phase: 'incomplete', runState: 'idle', report: current.report ?? 'Investigation finished without accepted evidence.', limitations: collectLimitations(current), progress: emptyProgress() }))
    }
    if (['investigating', 'ready_for_report', 'writing'].includes(this.require(id).phase)) throw new Error('the research agent stopped before saving a report')
  }

  private async runScoutForQuestion(id: ResearchId, run: ActiveResearchRun, questionId: ResearchQuestionId): Promise<void> {
    const project = this.require(id)
    const question = project.questions.find(item => item.id === questionId)
    if (question === undefined) return
    const dependency = collectDependencyContext(question, project.questions, project.evidence)
    await this.update(id, current => ({
      ...current,
      questions: current.questions.map(item => item.id === questionId ? { ...item, status: 'running' } : item),
      progress: mergeScoutProgress(current.progress, emptyScoutProgress(questionId, { role: 'scout', status: 'running', dependencySummary: dependency.text, activity: 'Starting scout.' })),
    }))
    for (const criterion of question.criteria) {
      if (run.controller.signal.aborted) return
      if (['covered', 'partial', 'blocked'].includes(criterion.status)) continue
      await this.runCriterion(id, run, questionId, criterion.id, dependency.text)
    }
    if (run.controller.signal.aborted) return
    const after = this.require(id)
    const latestQuestion = after.questions.find(item => item.id === questionId)
    if (latestQuestion === undefined) return
    const acceptedCount = after.evidence.filter(item => item.questionId === questionId && item.status === 'accepted').length
    const status = questionStatusFromCoverage(latestQuestion.criteria, acceptedCount)
    const handoff = buildScoutHandoff({ ...latestQuestion, status }, after.evidence)
    await this.update(id, current => {
      const questions = current.questions.map(item => item.id === questionId
        ? { ...item, status, gaps: deriveQuestionGaps(item.criteria), handoff }
        : item)
      const settled = questions.every(item => ['covered', 'partial', 'blocked'].includes(item.status))
      return {
        ...current,
        questions,
        phase: settled ? 'ready_for_report' : 'investigating',
        progress: mergeScoutProgress(current.progress, {
          ...emptyScoutProgress(questionId),
          role: 'scout',
          status: status === 'covered' ? 'done' : status === 'partial' ? 'partial' : 'blocked',
          handoff,
          activity: 'Question settled.',
          toolsCap: TOOLS_PER_CRITERION,
        }),
      }
    })
  }

  private async runCriterion(id: ResearchId, run: ActiveResearchRun, questionId: ResearchQuestionId, criterionId: string, dependencyContext: string): Promise<void> {
    const project = this.require(id)
    const question = project.questions.find(item => item.id === questionId)
    const criterion = question?.criteria.find(item => item.id === criterionId)
    if (question === undefined || criterion === undefined) return
    const urlIndex = new Map<string, IndexedUrl>()
    const knownQueries = new Set<string>()
    let toolsUsed = 0
    let fuseRejectCount = 0
    let forceAfterFuseMiss = false
    let submitted = false
    let submittedCandidates: Candidate[] = []
    let submittedSummary = ''
    let submittedGap = ''
    const web = this.requireWeb()
    const toolsCap = TOOLS_PER_CRITERION

    const patchScout = async (patch: Partial<ResearchScoutProgress>) => {
      await this.update(id, current => {
        const previous = current.progress.scouts.find(item => item.questionId === questionId) ?? emptyScoutProgress(questionId)
        return { ...current, progress: mergeScoutProgress(current.progress, { ...previous, role: 'scout', status: 'running', activeCriterionId: criterionId, activeCriterionText: criterion.text, toolsUsed, toolsCap, ...patch }) }
      })
    }

    await this.spawnRole(id, run, {
      tools: ['research_web_search', 'research_web_fetch', 'read_artifact', 'submit_criterion_candidates'],
      system: scoutSystemPrompt(),
      user: scoutUserPrompt({ question: project.question, goal: project.goal, subQuestion: question.text, criterionId, criterionText: criterion.text, toolsCap, toolsUsed: 0, dependencyContext }),
      nudge: scoutNudgePrompt(),
      register: ctx => {
        ctx.tools.register(defineTool({
          name: 'research_web_search',
          description: 'Search the web for the current Deep Research criterion. criterionId must match the current target. Counts toward the per-criterion fuse.',
          parameters: { query: { type: 'string', required: true }, criterionId: { type: 'string', required: true }, max_results: { type: 'number' } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            if (toolsUsed >= toolsCap) {
              fuseRejectCount += 1
              if (fuseRejectCount >= 2) forceAfterFuseMiss = true
              return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` }
            }
            if (String(args.criterionId ?? '') !== criterionId) throw new Error(`Search rejected: current target criterion is ${criterionId}`)
            const query = String(args.query ?? '').trim()
            const normalized = normalizeQuery(query)
            if (normalized === '') throw new Error('Search rejected: query is required')
            if (knownQueries.has(normalized)) throw new Error('Search rejected: duplicate query for this criterion')
            knownQueries.add(normalized)
            await this.reserveBudget(id, 'searches')
            toolsUsed += 1
            const priorTools = this.require(id).progress.scouts.find(item => item.questionId === questionId)?.tools ?? []
            await patchScout({ activity: `Search: ${query}`, tools: pushProgressTool(priorTools, { name: 'research_web_search', detail: query, status: 'running' }) })
            const result = await web.search({ query, maxResults: typeof args.max_results === 'number' ? args.max_results : 8 }, run.controller.signal)
            indexSearchResult(urlIndex, result.sources)
            await patchScout({ activity: `Search: ${query}`, tools: pushProgressTool(priorTools, { name: 'research_web_search', detail: query, status: 'done' }) })
            return { text: appendToolBudgetNote({ content: result.content, sources: result.sources }, toolsUsed, toolsCap) }
          },
          presentCall: args => presentGeneric('search', 'Research search', args?.query),
        }))
        ctx.tools.register(defineTool({
          name: 'research_web_fetch',
          description: 'Fetch a live web page. Returns artifactId for read_artifact. Counts toward the per-criterion fuse.',
          parameters: { url: { type: 'string', required: true } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            if (toolsUsed >= toolsCap) {
              fuseRejectCount += 1
              if (fuseRejectCount >= 2) forceAfterFuseMiss = true
              return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` }
            }
            const url = normalizeUrl(String(args.url ?? ''))
            if (url === '') throw new Error('Fetch rejected: url is required')
            await this.reserveBudget(id, 'fetches')
            toolsUsed += 1
            const fetched = await web.fetch({ url }, run.controller.signal)
            const body = fetched.body.content ?? ''
            const artifact = await persistArtifact({ projectId: id, questionId, criterionId, url, body })
            indexFetchResult(urlIndex, url, artifact?.preview ?? body, artifact?.artifactId ?? '', fetched.url)
            await patchScout({ activity: `Fetch: ${url}`, tools: pushProgressTool((this.require(id).progress.scouts.find(item => item.questionId === questionId)?.tools ?? []), { name: 'research_web_fetch', detail: url, status: 'done' }) })
            return { text: appendToolBudgetNote({ url: fetched.url, statusCode: fetched.statusCode, artifactId: artifact?.artifactId ?? null, artifactPersisted: artifact !== null, preview: artifact?.preview ?? '', artifactNote: artifact === null ? 'No artifact persisted (empty body).' : 'Use this exact artifactId with read_artifact.' }, toolsUsed, toolsCap) }
          },
          presentCall: args => presentGeneric('search', 'Research fetch', args?.url),
        }))
        ctx.tools.register(defineTool({
          name: 'read_artifact',
          description: 'Read more context from a source artifact previously fetched in this criterion. Successful reads count toward the fuse. Missing ids do not.',
          parameters: { artifactId: { type: 'string', required: true }, offset: { type: 'number' }, maxChars: { type: 'number' } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            if (toolsUsed >= toolsCap) {
              fuseRejectCount += 1
              if (fuseRejectCount >= 2) forceAfterFuseMiss = true
              return { text: `Tool fuse reached (${toolsCap}/${toolsCap}). Call submit_criterion_candidates with your candidates now.` }
            }
            try {
              const result = await readArtifact({ projectId: id, questionId, criterionId, artifactId: String(args.artifactId ?? ''), offset: typeof args.offset === 'number' ? args.offset : 0, maxChars: typeof args.maxChars === 'number' ? args.maxChars : 4000 })
              toolsUsed += 1
              await patchScout({ activity: `Read artifact ${result.artifactId}` })
              return { text: appendToolBudgetNote(result, toolsUsed, toolsCap) }
            } catch (error) {
              return { text: `${error instanceof Error ? error.message : String(error)} Failed read did not consume the fuse.` }
            }
          },
          presentCall: args => presentGeneric('search', 'Read artifact', args?.artifactId),
        }))
        ctx.tools.register(defineTool({
          name: 'submit_criterion_candidates',
          description: 'End search/fetch for the current criterion and deliver candidate findings. Does not count toward the fuse.',
          parameters: { candidates: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: { claim: { type: 'string' }, confidence: { type: 'string', enum: ['low', 'medium', 'high'] }, riskFlags: { type: 'array', items: { type: 'string' } }, sources: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { url: { type: 'string' }, snippet: { type: 'string' }, artifactId: { type: 'string' } } } } } } }, summary: { type: 'string', required: true }, gap: { type: 'string', required: true } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            submittedCandidates = normalizeSubmittedCandidates(args.candidates, criterionId)
            submittedSummary = String(args.summary ?? '')
            submittedGap = String(args.gap ?? '')
            submitted = true
            await patchScout({ activity: `Submitted ${submittedCandidates.length} candidate(s).`, scoutDraft: submittedSummary })
            return { text: JSON.stringify({ ok: true, acceptedForVerification: submittedCandidates.length }) }
          },
          presentCall: () => presentGeneric('edit', 'Submit candidates', criterionId),
        }))
      },
      done: () => submitted || forceAfterFuseMiss,
      onDraft: text => {
        const draft = readableRoleDraft(text)
        if (draft !== '') void patchScout({ scoutDraft: draft })
      },
      lastText: text => {
        if (submitted) return
        const parsed = parseCandidatesFromText(text, criterionId)
        submittedCandidates = parsed.candidates
        submittedSummary = parsed.summary
        submittedGap = parsed.gap
        submitted = true
      },
    })

    if (run.controller.signal.aborted) return
    const { accepted: gated, rejected: urlRejected } = gateCandidatesByUrl(submittedCandidates, urlIndex)
    const review = await this.runEvaluator(id, run, question, criterion, gated, submittedSummary, submittedGap)
    if (run.controller.signal.aborted) return
    const verdictById = new Map(review.verdicts.map(item => [item.candidateId, item]))
    const accepted = gated.filter(item => isAcceptedVerdict(verdictById.get(item.id)))
    for (const candidate of accepted) {
      const verdict = verdictById.get(candidate.id)
      const sources = uniqueSources((verdict?.sources.length ? verdict.sources : candidate.sources).map(source => {
        const artifactId = candidate.sources.find(item => item.url === source.url)?.artifactId
        return artifactId ? { url: source.url, snippet: source.snippet, artifactId } : { url: source.url, snippet: source.snippet }
      }))
      await this.addEvidence({
        id, questionId, criterionIds: [criterionId], source: sources[0]?.url || candidate.claim, url: sources[0]?.url, snippet: sources[0]?.snippet,
        sources, claim: candidate.claim, confidence: candidate.confidence, status: 'accepted',
      }).catch(() => undefined)
    }
    const latest = this.require(id)
    const acceptedCount = latest.evidence.filter(item => item.questionId === questionId && item.criterionIds.includes(criterionId) && item.status === 'accepted').length
    const coverage = criterionStatusFromReview(review.decision, acceptedCount)
    const reason = review.warnings.join('; ') || urlRejected[0]?.reason || coverage.reason
    await this.update(id, current => ({
      ...current,
      questions: current.questions.map(item => item.id !== questionId ? item : {
        ...item,
        criteria: item.criteria.map(entry => entry.id !== criterionId ? entry : {
          ...entry,
          status: coverage.status,
          summary: review.summary,
          gap: review.gap,
          warning: review.warnings.join('; '),
          verification: review.decision,
          toolCount: toolsUsed,
        }),
        gaps: deriveQuestionGaps(item.criteria.map(entry => entry.id !== criterionId ? entry : { ...entry, status: coverage.status, gap: review.gap })),
      }),
      progress: mergeScoutProgress(current.progress, {
        ...(current.progress.scouts.find(item => item.questionId === questionId) ?? emptyScoutProgress(questionId)),
        activity: reason,
        toolsUsed,
        toolsCap,
      }),
    }))
    await cleanupCriterionArtifacts(id, questionId, criterionId)
  }

  private async runEvaluator(id: ResearchId, run: ActiveResearchRun, question: ResearchQuestion, criterion: ResearchCriterion, gated: Candidate[], scoutSummary: string, scoutGap: string): Promise<CriterionReview> {
    let submitted: CriterionReview | null = gated.length === 0
      ? { decision: 'FAIL', warnings: [], verdicts: [], summary: scoutSummary, gap: scoutGap || 'No attributable candidates were verified.' }
      : null
    if (submitted !== null) return submitted
    let artifactReads = 0
    await this.update(id, current => {
      const previous = current.progress.scouts.find(item => item.questionId === question.id) ?? emptyScoutProgress(question.id)
      return { ...current, progress: mergeScoutProgress(current.progress, { ...previous, role: 'evaluator', status: 'verifying', activity: 'Evaluator reviewing candidates.', activeCriterionId: criterion.id, activeCriterionText: criterion.text }) }
    })
    await this.spawnRole(id, run, {
      tools: ['read_artifact', 'submit_criterion_review'],
      system: evaluatorSystemPrompt(),
      user: evaluatorUserPrompt({
        subQuestion: question.text, criterionId: criterion.id, criterionText: criterion.text, scoutSummary, scoutGap,
        candidatesJson: JSON.stringify(gated.map(item => ({ candidateId: item.id, claim: item.claim, confidence: item.confidence, riskFlags: item.riskFlags, sources: item.sources.map(source => ({ url: source.url, snippet: source.snippet, artifactId: source.artifactId, toolText: source.toolText })) })), null, 2),
      }),
      nudge: evaluatorNudgePrompt(),
      register: ctx => {
        ctx.tools.register(defineTool({
          name: 'read_artifact',
          description: 'Read an artifact from the Scout run. Failed/missing ids do not consume the evaluator read budget.',
          parameters: { artifactId: { type: 'string', required: true }, offset: { type: 'number' }, maxChars: { type: 'number' } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            if (artifactReads >= 3) return { text: 'Artifact read budget reached (3/3). Submit your review now.' }
            try {
              const result = await readArtifact({ projectId: id, questionId: question.id, criterionId: criterion.id, artifactId: String(args.artifactId ?? ''), offset: typeof args.offset === 'number' ? args.offset : 0, maxChars: typeof args.maxChars === 'number' ? args.maxChars : 4000 })
              artifactReads += 1
              await this.update(id, current => {
                const previous = current.progress.scouts.find(item => item.questionId === question.id) ?? emptyScoutProgress(question.id)
                return { ...current, progress: mergeScoutProgress(current.progress, { ...previous, activity: `Evaluator read ${result.artifactId}` }) }
              })
              return { text: JSON.stringify(result) }
            } catch (error) {
              return { text: `${error instanceof Error ? error.message : String(error)} Failed read did not consume the artifact-read budget.` }
            }
          },
          presentCall: args => presentGeneric('search', 'Read artifact', args?.artifactId),
        }))
        ctx.tools.register(defineTool({
          name: 'submit_criterion_review',
          description: 'Finish evaluator review for the current criterion.',
          parameters: { decision: { type: 'string', required: true, enum: ['PASS', 'WARNING', 'FAIL'] }, warnings: { type: 'array', items: { type: 'string' } }, verdicts: { type: 'array', required: true, items: { type: 'object', additionalProperties: false, properties: { candidateId: { type: 'string' }, supported: { type: 'boolean' }, relevantToCriterion: { type: 'boolean' }, reason: { type: 'string' }, sources: { type: 'array', items: { type: 'object', additionalProperties: false, properties: { url: { type: 'string' }, snippet: { type: 'string' } } } } } } }, summary: { type: 'string', required: true }, gap: { type: 'string', required: true } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            submitted = normalizeReview(args as Record<string, unknown>, gated, scoutSummary, scoutGap)
            return { text: JSON.stringify({ ok: true, message: 'Criterion review recorded.' }) }
          },
          presentCall: () => presentGeneric('edit', 'Submit review', criterion.id),
        }))
      },
      done: () => submitted !== null,
      onDraft: text => {
        const draft = readableRoleDraft(text)
        if (draft === '') return
        void this.update(id, current => {
          const previous = current.progress.scouts.find(item => item.questionId === question.id) ?? emptyScoutProgress(question.id)
          return { ...current, progress: mergeScoutProgress(current.progress, { ...previous, evaluatorDraft: draft }) }
        })
      },
      lastText: text => {
        if (submitted !== null) return
        submitted = parseReviewFromText(text, gated, scoutSummary, scoutGap)
      },
    })
    if (run.controller.signal.aborted) {
      return submitted ?? { decision: 'WARNING', warnings: ['Review stopped by user.'], verdicts: [], summary: scoutSummary, gap: scoutGap }
    }
    return submitted ?? { decision: 'WARNING', warnings: [], verdicts: gated.map(item => ({ candidateId: item.id, supported: false, relevantToCriterion: false, reason: 'Evaluator did not submit a review.', sources: [] })), summary: scoutSummary, gap: scoutGap }
  }

  private async runWriting(id: ResearchId, run: ActiveResearchRun): Promise<void> {
    const project = this.require(id)
    let submitted = false
    await this.spawnRole(id, run, {
      tools: ['deep_research_complete'],
      system: writerSystemPrompt(project.depth),
      user: writerUserPrompt(buildResearchWritingPack(project)),
      nudge: writerNudgePrompt(),
      register: ctx => {
        ctx.tools.register(defineTool({
          name: 'deep_research_complete',
          description: 'Save the evidence-based report. Write limitations into the report body.',
          parameters: { report: { type: 'string', required: true }, conclusions: { type: 'array', items: { type: 'string' } }, limitations: { type: 'array', items: { type: 'string' } }, partial: { type: 'boolean' } },
          output: { schema: TEXT_OUTPUT, render: (_args, value) => [{ type: 'text', text: value.text }] },
          execute: async args => {
            const completed = await this.complete({ id, report: String(args.report ?? ''), conclusions: args.conclusions as string[] | undefined, limitations: args.limitations as string[] | undefined, partial: Boolean(args.partial) })
            submitted = true
            return { text: projectSummary(completed) }
          },
          presentCall: () => presentGeneric('edit', 'Complete deep research', id),
        }))
      },
      done: () => submitted,
      onDraft: text => {
        void this.update(id, current => current.phase === 'writing' ? { ...current, report: text } : current)
      },
    })
  }

  private async spawnRole(_id: ResearchId, run: ActiveResearchRun, spec: {
    tools: string[]
    system: string
    user: string
    nudge: string
    register: (ctx: Context) => void
    done: () => boolean
    lastText?: (text: string) => void
    onDraft?: (text: string) => void
  }): Promise<void> {
    const selection = this.ctx.agentDefaultModel.currentSelection()
    const handle = await this.ctx.agents.create({
      sessionId: SessionId(`deepresearch-run-${randomUUID()}`),
      meta: { cwd: resolve(this.config.runnerCwd), origin: 'subagent', delegationDepth: 1 },
      agentOptions: { provider: selection.provider, model: selection.model },
      signal: run.controller.signal,
      setup: async (agentCtx) => {
        await this.ctx.agentPresets.mount(agentCtx, 'standard')
        agentCtx.tools.restrict({ allow: [] })
        spec.register(agentCtx)
        agentCtx.systemPrompt.section({ name: 'deepresearch:runner', order: 10_000, text: spec.system })
      },
    })
    run.handles.push(handle)
    if (run.controller.signal.aborted) {
      await handle.dispose()
      const early = run.handles.indexOf(handle)
      if (early >= 0) run.handles.splice(early, 1)
      return
    }
    const stopDraft = watchDraft(handle, text => { spec.onDraft?.(text) })
    try {
      handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: spec.user }], source: { kind: 'user' } }))
      await handle.agent.whenIdle()
      if (run.controller.signal.aborted) return
      spec.onDraft?.(lastAssistantText(handle))
      if (!spec.done() && !run.controller.signal.aborted) {
        handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: spec.nudge }], source: { kind: 'user' } }))
        await handle.agent.whenIdle()
        if (run.controller.signal.aborted) return
        spec.onDraft?.(lastAssistantText(handle))
      }
      if (!spec.done() && !run.controller.signal.aborted && spec.lastText !== undefined) spec.lastText(lastAssistantText(handle))
    } finally {
      stopDraft()
      await handle.dispose()
      const index = run.handles.indexOf(handle)
      if (index >= 0) run.handles.splice(index, 1)
    }
  }

  private markPaused(id: ResearchId): Promise<ResearchProject> {
    const current = this.requireTable().get(id)
    if (current !== undefined) this.emitProgress(snapshot({ ...current, runState: 'paused', updatedAt: Math.max(Date.now(), current.updatedAt + 1) }))
    return this.update(id, project => ({ ...project, runState: 'paused' }))
  }

  private stopRun(id: ResearchId): void {
    const run = this.activeRuns.get(id)
    if (run === undefined) return
    run.controller.abort()
    for (const handle of run.handles) handle.agent.cancel({ kind: 'user' })
  }

  private async reserveBudget(id: ResearchId, tool: 'searches' | 'fetches'): Promise<void> {
    let exhausted = false
    await this.update(id, project => {
      if (tool === 'searches' && project.budget.searchesUsed >= project.budget.maxSearches) { exhausted = true; return project }
      if (tool === 'fetches' && project.budget.fetchesUsed >= project.budget.maxFetches) { exhausted = true; return project }
      return {
      ...project,
        budget: tool === 'searches'
          ? { ...project.budget, searchesUsed: project.budget.searchesUsed + 1 }
          : { ...project.budget, fetchesUsed: project.budget.fetchesUsed + 1 },
      }
    })
    if (exhausted) throw new Error(tool === 'searches' ? 'Session search safety budget exhausted' : 'Session fetch safety budget exhausted')
  }

  private buildQuestions(input: ResearchStartRequest['questions'], depth: ResearchStartRequest['depth']): ResearchQuestion[] {
    assertPlanFitsDepth(depth, input, this.config)
    const ids = input.map(() => ResearchQuestionId(`rq-${randomUUID()}`))
    return input.map((item, index) => ({
      id: ids[index] as ResearchQuestionId,
      text: requiredText(item.text, `questions[${index}].text`),
      dependsOn: (item.dependsOn ?? []).map(dep => { const depId = ids[dep]; if (depId === undefined || dep >= index) throw new TypeError(`deepresearch: questions[${index}] has invalid dependency ${dep}`); return depId }),
      status: 'pending',
      criteria: item.criteria.map((text, criterionIndex) => ({ id: `c${index + 1}.${criterionIndex + 1}`, text: requiredText(text, `questions[${index}].criteria[${criterionIndex}]`), status: 'missing', summary: '', gap: '', warning: '', verification: '', toolCount: 0 })),
      gaps: [],
      handoff: '',
    }))
  }

  private require(id: ResearchId): ResearchProject {
    const project = this.get({ id })
    if (project === null) throw new Error(`deepresearch: project ${id} not found`)
    return project
  }

  private requireWeb(): WebLike {
    const web = this.ctx.get('web') as WebLike | undefined
    if (web === undefined) throw new Error('ctx.web is not available; mount a search provider and @deepseek-ai/dsh-web-fetch-http for research fetch')
    return web
  }

  private update(id: ResearchId, mutate: (project: ResearchProject) => ResearchProject): Promise<ResearchProject> {
    return this.enqueue(async () => {
      const table = this.requireTable(); const current = table.get(id); if (current === undefined) throw new Error(`deepresearch: project ${id} not found`)
      const project = snapshot({ ...mutate(snapshot(current)), updatedAt: Math.max(Date.now(), current.updatedAt + 1) })
      await table.put(id, project)
      this.emitProgress(project)
      return snapshot(project)
    })
  }

  private emitProgress(project: ResearchProject): void {
    this.ctx.emit('deepResearch/progress', snapshot(project))
  }
  private enqueue<T>(operation: () => Promise<T>): Promise<T> { const result = this.mutationTail.then(operation); this.mutationTail = result.then(() => undefined, () => undefined); return result }
  private requireTable(): KvTable<ResearchId, ResearchProject> { if (this.table === undefined) throw new Error('deepresearch: durable domain is not initialized'); return this.table }
}

function presentGeneric(kind: 'search' | 'edit', title: string, rawInput: unknown): { card: 'generic'; kind: 'search' | 'edit'; title: string; rawInput: string } {
  let text = ''
  try { text = typeof rawInput === 'string' ? rawInput : rawInput == null ? '' : JSON.stringify(rawInput) } catch { text = title }
  return { card: 'generic', kind, title, rawInput: text }
}

function seedInvestigationProgress(project: { questions: readonly { id: import('./types.ts').ResearchQuestionId; dependsOn: readonly import('./types.ts').ResearchQuestionId[] }[] }) {
  return project.questions.reduce((progress, question) => mergeScoutProgress(progress, emptyScoutProgress(question.id, {
    role: 'waiting',
    status: 'waiting',
    waitingOn: [...question.dependsOn],
    activity: question.dependsOn.length > 0 ? 'Waiting on upstream sub-questions.' : 'Queued for the next scout wave.',
  })), emptyProgress())
}

function requiredText(value: string, field: string): string { const text = value.trim(); if (text === '') throw new TypeError(`deepresearch: ${field} must not be blank`); return text }
function optionalText(value: string | undefined): string { return value?.trim() ?? '' }
function normalizeList(values: readonly string[]): string[] { return [...new Set(values.map(value => value.trim()).filter(Boolean))] }
function researchText(project: ResearchProject): string {
  return [project.title, project.question, project.goal, project.constraints, project.seedText, project.report ?? '', ...project.questions.flatMap(question => [question.text, question.handoff, ...question.gaps, ...question.criteria.flatMap(criterion => [criterion.text, criterion.summary, criterion.gap, criterion.warning])]), ...project.evidence.flatMap(evidence => [evidence.source, evidence.url ?? '', evidence.claim, evidence.snippet])].join('\n').toLocaleLowerCase()
}
function projectSummary(project: ResearchProject): string { return `${project.title} (${project.id})\nPhase: ${project.phase}; questions: ${project.questions.length}; evidence: ${project.evidence.length}\n${project.question}` }
function hydrateCriterion(criterion: ResearchCriterion): ResearchCriterion {
  return { ...criterion, warning: criterion.warning ?? '', verification: criterion.verification ?? '', toolCount: criterion.toolCount ?? 0 }
}
function hydrateQuestion(question: ResearchQuestion): ResearchQuestion {
  return { ...question, dependsOn: [...question.dependsOn], gaps: [...(question.gaps ?? [])], handoff: question.handoff ?? '', criteria: question.criteria.map(hydrateCriterion) }
}
function hydrateEvidence(item: ResearchEvidence): ResearchEvidence {
  const sources = uniqueSources(item.sources?.length ? item.sources : (item.url || item.snippet ? [{ url: item.url ?? '', snippet: item.snippet }] : []))
  return { ...item, criterionIds: [...item.criterionIds], status: item.status ?? 'accepted', url: sources[0]?.url || item.url, snippet: sources[0]?.snippet || item.snippet, sources }
}
function resumeRunnerPhase(project: ResearchProject): RunnerPhase {
  if (!project.planConfirmed || project.phase === 'planning' || project.phase === 'awaiting_plan_confirm') return 'planning'
  if (project.phase === 'writing' || project.phase === 'done') return 'writing'
  return 'investigating'
}

function resumeProjectPhase(project: ResearchProject, phase: RunnerPhase): ResearchProject['phase'] {
  if (phase === 'planning') return project.planConfirmed ? project.phase : project.phase === 'failed' || project.phase === 'aborted' ? 'planning' : project.phase
  if (phase === 'writing') return 'writing'
  if (project.phase === 'aborted' || (project.phase === 'failed' && project.planConfirmed)) return 'investigating'
  return project.phase
}

function snapshot(project: ResearchProject): ResearchProject {
  return Object.freeze({
    ...project,
    runState: project.runState ?? (['planning', 'investigating', 'writing'].includes(project.phase) ? 'running' : 'idle'),
    questions: project.questions.map(question => Object.freeze(hydrateQuestion(question))),
    evidence: project.evidence.map(item => Object.freeze(hydrateEvidence(item))),
    conclusions: [...project.conclusions],
    limitations: [...project.limitations],
    budget: Object.freeze({ ...project.budget }),
    progress: Object.freeze({
      running: project.progress?.running ?? 0,
      waiting: project.progress?.waiting ?? 0,
      scouts: (project.progress?.scouts ?? []).map(scout => Object.freeze({
        questionId: scout.questionId,
        role: scout.role ?? 'waiting',
        status: scout.status ?? 'waiting',
        waitingOn: [...(scout.waitingOn ?? [])],
        toolsUsed: scout.toolsUsed ?? 0,
        toolsCap: scout.toolsCap ?? 0,
        activity: scout.activity ?? '',
        tools: [...(scout.tools ?? [])],
        scoutDraft: scout.scoutDraft ?? '',
        evaluatorDraft: scout.evaluatorDraft ?? '',
        activeCriterionId: scout.activeCriterionId ?? '',
        activeCriterionText: scout.activeCriterionText ?? '',
        dependencySummary: scout.dependencySummary ?? '',
        handoff: scout.handoff ?? '',
      })),
    }),
  })
}

function lastAssistantText(handle: AgentHandle): string {
  const agent = handle.agent as { messages?: unknown; session?: { messages?: unknown } }
  const messages = Array.isArray(agent.messages) ? agent.messages : Array.isArray(agent.session?.messages) ? agent.session.messages : []
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index] as { role?: string; content?: unknown }
    if (message.role !== 'assistant') continue
    const text = messageText(message.content)
    if (text !== '') return text
  }
  return ''
}

function messageText(content: unknown): string {
  if (typeof content === 'string') return content
  if (!Array.isArray(content)) return ''
  return content.map(block => typeof block === 'string' ? block : String((block as { text?: string }).text ?? '')).join('')
}

function watchDraft(handle: AgentHandle, onDraft: (text: string) => void): () => void {
  let last = ''
  let streamed = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  const push = (text: string) => {
    const next = text.trim()
    if (next === '' || next === last) return
    last = next
    onDraft(next.slice(0, 4000))
  }
  const emit = () => { push(streamed || lastAssistantText(handle)) }
  const schedule = () => {
    if (timer !== undefined) return
    timer = setTimeout(() => { timer = undefined; emit() }, 400)
  }
  const ctx = handle.agent.ctx as { on?: (event: string, listener: (payload?: unknown) => void) => () => void } | undefined
  const offChunk = ctx?.on?.('assistant/chunk', payload => {
    const chunk = (payload as { chunk?: { type?: string; text?: string } } | undefined)?.chunk
    if (chunk?.type === 'text-delta' && chunk.text) {
      streamed += chunk.text
      schedule()
    }
  })
  const offMessage = ctx?.on?.('assistant/message', payload => {
    const text = messageText((payload as { message?: { content?: unknown } } | undefined)?.message?.content)
    if (text !== '') {
      streamed = text
      emit()
    }
  })
  const poll = setInterval(emit, 600)
  emit()
  return () => {
    if (timer !== undefined) clearTimeout(timer)
    clearInterval(poll)
    offChunk?.()
    offMessage?.()
  }
}

export default DeepResearchService
