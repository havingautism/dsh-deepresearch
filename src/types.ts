/** Public wire values for durable Codemini-style Deep Research projects. */

import type { Branded } from '@deepseek-ai/dsh-brand'

/** Opaque research project identity. */
export type ResearchId = Branded<'ResearchId'>
/**
 * Construct a research project identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded project identity.
 */
export const ResearchId = (value: string): ResearchId => value as ResearchId
/** Opaque planned-question identity. */
export type ResearchQuestionId = Branded<'ResearchQuestionId'>
/**
 * Construct a planned-question identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded question identity.
 */
export const ResearchQuestionId = (value: string): ResearchQuestionId => value as ResearchQuestionId
/** Opaque evidence identity. */
export type ResearchEvidenceId = Branded<'ResearchEvidenceId'>
/**
 * Construct an evidence identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded evidence identity.
 */
export const ResearchEvidenceId = (value: string): ResearchEvidenceId => value as ResearchEvidenceId

/** Supported investigation depths. */
export type ResearchDepth = 'quick' | 'standard' | 'deep'
/** Durable research lifecycle phase. */
export type ResearchPhase = 'planning' | 'awaiting_plan_confirm' | 'investigating' | 'ready_for_report' | 'incomplete' | 'writing' | 'done' | 'failed' | 'aborted'
/** Whether a private runner is live, idle, or user-paused. */
export type ResearchRunState = 'idle' | 'running' | 'paused'
/** Progress state for one planned sub-question. */
export type ResearchQuestionStatus = 'pending' | 'running' | 'covered' | 'partial' | 'blocked' | 'failed'
/** Evidence coverage state for one success criterion. */
export type ResearchCoverageStatus = 'missing' | 'partial' | 'covered' | 'conflicted' | 'blocked'
/** Reviewer confidence assigned to one evidence item. */
export type ResearchConfidence = 'low' | 'medium' | 'high'
/** Evaluator decision for one criterion. */
export type ResearchVerification = '' | 'PASS' | 'WARNING' | 'FAIL'
/** Evidence review state. Missing on old rows means accepted. */
export type ResearchEvidenceStatus = 'candidate' | 'accepted' | 'rejected'
/** Live scout card role. */
export type ResearchScoutRole = 'waiting' | 'scout' | 'evaluator' | 'writing'

/** One source bound to a claim. */
export interface ResearchEvidenceSource {
  readonly url: string
  readonly snippet: string
  readonly artifactId?: string | undefined
}

/** One acceptance criterion tracked for a research sub-question. */
export interface ResearchCriterion {
  readonly id: string
  readonly text: string
  readonly status: ResearchCoverageStatus
  readonly summary: string
  readonly gap: string
  readonly warning: string
  readonly verification: ResearchVerification
  readonly toolCount: number
}

/** One planned sub-question and its coverage state. */
export interface ResearchQuestion {
  readonly id: ResearchQuestionId
  readonly text: string
  readonly dependsOn: ResearchQuestionId[]
  readonly status: ResearchQuestionStatus
  readonly criteria: ResearchCriterion[]
  readonly gaps: string[]
  readonly handoff: string
}

/** One accepted or reviewable source-backed finding. */
export interface ResearchEvidence {
  readonly id: ResearchEvidenceId
  readonly questionId: ResearchQuestionId
  readonly criterionIds: string[]
  readonly source: string
  readonly url: string | null
  readonly snippet: string
  readonly sources: ResearchEvidenceSource[]
  readonly claim: string
  readonly confidence: ResearchConfidence
  readonly status: ResearchEvidenceStatus
  readonly createdAt: number
}

/** Planned and consumed investigation budget. */
export interface ResearchBudget {
  readonly maxSearches: number
  readonly maxFetches: number
  readonly searchesUsed: number
  readonly fetchesUsed: number
}

/** One recent tool row on a scout card. */
export interface ResearchProgressTool {
  readonly name: string
  readonly detail: string
  readonly status: 'running' | 'done'
}

/** Live process state for one sub-question scout. */
export interface ResearchScoutProgress {
  readonly questionId: ResearchQuestionId
  readonly role: ResearchScoutRole
  readonly status: 'waiting' | 'running' | 'verifying' | 'done' | 'partial' | 'blocked'
  readonly waitingOn: ResearchQuestionId[]
  readonly toolsUsed: number
  readonly toolsCap: number
  readonly activity: string
  readonly tools: ResearchProgressTool[]
  readonly scoutDraft: string
  readonly evaluatorDraft: string
  readonly activeCriterionId: string
  readonly activeCriterionText: string
  readonly dependencySummary: string
  readonly handoff: string
}

/** Coarse investigation process snapshot for the overlay poll. */
export interface ResearchProgress {
  readonly running: number
  readonly waiting: number
  readonly scouts: ResearchScoutProgress[]
}

/** One durable research project. */
export interface ResearchProject {
  readonly id: ResearchId
  readonly title: string
  readonly question: string
  readonly goal: string
  readonly constraints: string
  readonly seedText: string
  readonly depth: ResearchDepth
  readonly phase: ResearchPhase
  readonly runState: ResearchRunState
  readonly planConfirmed: boolean
  readonly questions: ResearchQuestion[]
  readonly evidence: ResearchEvidence[]
  readonly conclusions: string[]
  readonly limitations: string[]
  readonly report: string | null
  readonly budget: ResearchBudget
  readonly progress: ResearchProgress
  readonly createdAt: number
  readonly updatedAt: number
}

/** Create a project with an editable question plan. */
export interface ResearchStartRequest {
  readonly title?: string
  readonly question: string
  readonly goal?: string
  readonly constraints?: string
  readonly seedText?: string
  readonly depth: ResearchDepth
  readonly questions: Array<{ readonly text: string; readonly criteria: string[]; readonly dependsOn?: number[] }>
}
/** Replace the unconfirmed plan of an existing project. */
export interface ResearchPlanUpdateRequest { readonly id: ResearchId; readonly goal: string; readonly constraints: string; readonly depth: ResearchDepth; readonly questions: Array<{ readonly text: string; readonly criteria: string[]; readonly dependsOn?: number[] }> }
/** Confirm a reviewed project plan. */
export interface ResearchConfirmRequest { readonly id: ResearchId }
/** Attach a source-backed claim to one question. */
export interface ResearchEvidenceRequest {
  readonly id: ResearchId
  readonly questionId: ResearchQuestionId
  readonly criterionIds?: string[] | undefined
  readonly source: string
  readonly url?: string | undefined
  readonly snippet?: string | undefined
  readonly sources?: ResearchEvidenceSource[] | undefined
  readonly claim: string
  readonly confidence: ResearchConfidence
  readonly status?: ResearchEvidenceStatus | undefined
}
/** Update question progress and optional criterion coverage. */
export interface ResearchQuestionUpdateRequest { readonly id: ResearchId; readonly questionId: ResearchQuestionId; readonly status: ResearchQuestionStatus; readonly criteria?: ResearchCriterion[] }
/** Save a final or explicitly partial report. */
export interface ResearchCompleteRequest { readonly id: ResearchId; readonly report: string; readonly conclusions?: string[] | undefined; readonly limitations?: string[] | undefined; readonly partial?: boolean | undefined }
/** Record an aborted or failed investigation. `aborted` pauses the run and keeps evidence. */
export interface ResearchFailRequest { readonly id: ResearchId; readonly reason: string; readonly aborted?: boolean }
/** Resume a paused planning or investigation run. */
export interface ResearchResumeRequest { readonly id: ResearchId }
/** Start or rewrite the report from current evidence. */
export interface ResearchWriteReportRequest { readonly id: ResearchId }
/** Filter projects by searchable content and lifecycle phase. */
export interface ResearchListRequest { readonly query?: string; readonly phase?: ResearchPhase }
/** Project listing response, newest edit first. */
export interface ResearchListResult { readonly projects: ResearchProject[] }
/** Exact project lookup. */
export interface ResearchGetRequest { readonly id: ResearchId }
/** Delete one research project. */
export interface ResearchDeleteRequest { readonly id: ResearchId }
/** Stable project deletion outcome. */
export interface ResearchDeleteResult { readonly deleted: boolean }

declare module '@deepseek-ai/cordis' {
  interface Events {
    /**
     * Live project snapshot after each durable mutation so the workspace
     * can refresh plans, scout tools, and agent drafts without polling.
     * @param project - detached project after the mutation.
     * @mode emit
     */
    'deepResearch/progress'(project: ResearchProject): void
  }
}
