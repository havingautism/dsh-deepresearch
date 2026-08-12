/** Public wire values for durable deep-research projects. */
import type { Branded } from '@deepseek-ai/dsh-brand';
/** Opaque research project identity. */
export type ResearchId = Branded<'ResearchId'>;
/** Construct a research identity at its owning boundary. */
export declare const ResearchId: (value: string) => ResearchId;
/** Research depth selected by the caller. */
export type ResearchDepth = 'quick' | 'standard' | 'deep';
/** Durable workflow phase. */
export type ResearchPhase = 'planning' | 'researching' | 'synthesizing' | 'complete';
/** One source-backed finding. */
export interface ResearchEvidence {
    readonly source: string;
    readonly url: string | null;
    readonly summary: string;
}
/** One durable research project. */
export interface ResearchProject {
    readonly id: ResearchId;
    readonly question: string;
    readonly depth: ResearchDepth;
    readonly phase: ResearchPhase;
    readonly plan: string[];
    readonly evidence: ResearchEvidence[];
    readonly report: string | null;
    readonly createdAt: number;
    readonly updatedAt: number;
}
/** Create a research project and freeze its initial plan. */
export interface ResearchStartRequest {
    readonly question: string;
    readonly depth: ResearchDepth;
    readonly plan: string[];
}
/** Attach one source-backed finding. */
export interface ResearchEvidenceRequest {
    readonly id: ResearchId;
    readonly source: string;
    readonly url?: string;
    readonly summary: string;
}
/** Complete synthesis with the final report. */
export interface ResearchCompleteRequest {
    readonly id: ResearchId;
    readonly report: string;
}
/** Filter for the research board. */
export interface ResearchListRequest {
    readonly query?: string;
    readonly phase?: ResearchPhase;
}
/** Research board response. */
export interface ResearchListResult {
    readonly projects: ResearchProject[];
}
/** Exact project lookup. */
export interface ResearchGetRequest {
    readonly id: ResearchId;
}
//# sourceMappingURL=types.d.ts.map