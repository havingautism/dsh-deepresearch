/** Public wire values for durable Codemini-style Deep Research projects. */
import type { Branded } from '@deepseek-ai/dsh-brand';
/** Opaque research project identity. */
export type ResearchId = Branded<'ResearchId'>;
/**
 * Construct a research project identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded project identity.
 */
export declare const ResearchId: (value: string) => ResearchId;
/** Opaque planned-question identity. */
export type ResearchQuestionId = Branded<'ResearchQuestionId'>;
/**
 * Construct a planned-question identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded question identity.
 */
export declare const ResearchQuestionId: (value: string) => ResearchQuestionId;
/** Opaque evidence identity. */
export type ResearchEvidenceId = Branded<'ResearchEvidenceId'>;
/**
 * Construct an evidence identity at its owning boundary.
 * @param value - persisted or wire identity.
 * @returns branded evidence identity.
 */
export declare const ResearchEvidenceId: (value: string) => ResearchEvidenceId;
/** Supported investigation depths. */
export type ResearchDepth = 'quick' | 'standard' | 'deep';
/** Durable research lifecycle phase. */
export type ResearchPhase = 'planning' | 'awaiting_plan_confirm' | 'investigating' | 'ready_for_report' | 'incomplete' | 'writing' | 'done' | 'failed' | 'aborted';
/** Progress state for one planned sub-question. */
export type ResearchQuestionStatus = 'pending' | 'running' | 'covered' | 'partial' | 'blocked' | 'failed';
/** Evidence coverage state for one success criterion. */
export type ResearchCoverageStatus = 'missing' | 'partial' | 'covered' | 'conflicted' | 'blocked';
/** Reviewer confidence assigned to one evidence item. */
export type ResearchConfidence = 'low' | 'medium' | 'high';
/** One acceptance criterion tracked for a research sub-question. */
export interface ResearchCriterion {
    readonly id: string;
    readonly text: string;
    readonly status: ResearchCoverageStatus;
    readonly summary: string;
    readonly gap: string;
}
/** One planned sub-question and its coverage state. */
export interface ResearchQuestion {
    readonly id: ResearchQuestionId;
    readonly text: string;
    readonly dependsOn: ResearchQuestionId[];
    readonly status: ResearchQuestionStatus;
    readonly criteria: ResearchCriterion[];
}
/** One accepted or reviewable source-backed finding. */
export interface ResearchEvidence {
    readonly id: ResearchEvidenceId;
    readonly questionId: ResearchQuestionId;
    readonly criterionIds: string[];
    readonly source: string;
    readonly url: string | null;
    readonly snippet: string;
    readonly claim: string;
    readonly confidence: ResearchConfidence;
    readonly createdAt: number;
}
/** Planned and consumed investigation budget. */
export interface ResearchBudget {
    readonly maxSearches: number;
    readonly maxFetches: number;
    readonly searchesUsed: number;
    readonly fetchesUsed: number;
}
/** One durable research project. */
export interface ResearchProject {
    readonly id: ResearchId;
    readonly title: string;
    readonly question: string;
    readonly goal: string;
    readonly constraints: string;
    readonly seedText: string;
    readonly depth: ResearchDepth;
    readonly phase: ResearchPhase;
    readonly planConfirmed: boolean;
    readonly questions: ResearchQuestion[];
    readonly evidence: ResearchEvidence[];
    readonly conclusions: string[];
    readonly limitations: string[];
    readonly report: string | null;
    readonly budget: ResearchBudget;
    readonly createdAt: number;
    readonly updatedAt: number;
}
/** Create a project with an editable question plan. */
export interface ResearchStartRequest {
    readonly title?: string;
    readonly question: string;
    readonly goal?: string;
    readonly constraints?: string;
    readonly seedText?: string;
    readonly depth: ResearchDepth;
    readonly questions: Array<{
        readonly text: string;
        readonly criteria: string[];
        readonly dependsOn?: number[];
    }>;
}
/** Replace the unconfirmed plan of an existing project. */
export interface ResearchPlanUpdateRequest {
    readonly id: ResearchId;
    readonly goal: string;
    readonly constraints: string;
    readonly depth: ResearchDepth;
    readonly questions: Array<{
        readonly text: string;
        readonly criteria: string[];
        readonly dependsOn?: number[];
    }>;
}
/** Confirm a reviewed project plan. */
export interface ResearchConfirmRequest {
    readonly id: ResearchId;
}
/** Attach a source-backed claim to one question. */
export interface ResearchEvidenceRequest {
    readonly id: ResearchId;
    readonly questionId: ResearchQuestionId;
    readonly criterionIds?: string[];
    readonly source: string;
    readonly url?: string;
    readonly snippet?: string;
    readonly claim: string;
    readonly confidence: ResearchConfidence;
}
/** Update question progress and optional criterion coverage. */
export interface ResearchQuestionUpdateRequest {
    readonly id: ResearchId;
    readonly questionId: ResearchQuestionId;
    readonly status: ResearchQuestionStatus;
    readonly criteria?: ResearchCriterion[];
}
/** Save a final or explicitly partial report. */
export interface ResearchCompleteRequest {
    readonly id: ResearchId;
    readonly report: string;
    readonly conclusions?: string[];
    readonly limitations?: string[];
    readonly partial?: boolean;
}
/** Record an aborted or failed investigation. */
export interface ResearchFailRequest {
    readonly id: ResearchId;
    readonly reason: string;
    readonly aborted?: boolean;
}
/** Filter projects by searchable content and lifecycle phase. */
export interface ResearchListRequest {
    readonly query?: string;
    readonly phase?: ResearchPhase;
}
/** Project listing response, newest edit first. */
export interface ResearchListResult {
    readonly projects: ResearchProject[];
}
/** Exact project lookup. */
export interface ResearchGetRequest {
    readonly id: ResearchId;
}
/** Delete one research project. */
export interface ResearchDeleteRequest {
    readonly id: ResearchId;
}
/** Stable project deletion outcome. */
export interface ResearchDeleteResult {
    readonly deleted: boolean;
}
