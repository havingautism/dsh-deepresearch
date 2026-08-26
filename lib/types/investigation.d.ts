/** Pure investigation helpers aligned with Codemini Scout / Evaluator. */
import type { ResearchCoverageStatus, ResearchCriterion, ResearchEvidence, ResearchProgress, ResearchProgressTool, ResearchProject, ResearchQuestion, ResearchQuestionId, ResearchScoutProgress, ResearchVerification } from './types.ts';
export declare const MAX_CANDIDATES_PER_CRITERION = 3;
export declare const MAX_SOURCES_PER_CLAIM = 3;
export declare const MAX_EVALUATOR_ARTIFACT_READS = 3;
export declare const MAX_DEP_CLAIMS_PER_UPSTREAM = 8;
export declare const MAX_DEP_CONTEXT_CHARS = 4000;
export declare const MAX_URL_TEXT_FOR_VERIFY = 2500;
export declare const SETTLED_QUESTION: Set<string>;
export declare const TERMINAL_COVERAGE: Set<string>;
export interface IndexedUrl {
    url: string;
    text: string;
    artifactId: string;
}
export interface CandidateSource {
    url: string;
    snippet: string;
    artifactId: string;
    toolText: string;
}
export interface Candidate {
    id: string;
    claim: string;
    confidence: 'low' | 'medium' | 'high';
    riskFlags: string[];
    sources: CandidateSource[];
}
export interface CriterionReview {
    decision: ResearchVerification;
    warnings: string[];
    verdicts: Array<{
        candidateId: string;
        supported: boolean;
        relevantToCriterion: boolean;
        reason: string;
        sources: Array<{
            url: string;
            snippet: string;
        }>;
    }>;
    summary: string;
    gap: string;
}
export declare function clip(value: unknown, max?: number): string;
export declare function normalizeQuery(value: string): string;
export declare function normalizeUrl(value: string): string;
/** Keep the first occurrence of each normalized URL, up to the per-claim cap. */
export declare function uniqueSources<T extends {
    url: string;
}>(sources: readonly T[], max?: number): T[];
export declare function appendToolBudgetNote(payload: unknown, used: number, cap: number): string;
export declare function indexSearchResult(urlIndex: Map<string, IndexedUrl>, sources: ReadonlyArray<{
    url?: string;
    snippet?: string;
    title?: string;
}>): void;
export declare function indexFetchResult(urlIndex: Map<string, IndexedUrl>, url: string, text: string, artifactId: string, finalUrl?: string): void;
export declare function normalizeSubmittedCandidates(raw: unknown, criterionId: string): Candidate[];
export declare function gateCandidatesByUrl(candidates: Candidate[], urlIndex: Map<string, IndexedUrl>): {
    accepted: Candidate[];
    rejected: Array<Candidate & {
        reason: string;
    }>;
};
export declare function parseJsonObject(raw: string): Record<string, unknown> | null;
export declare function parseCandidatesFromText(raw: string, criterionId: string): {
    candidates: Candidate[];
    summary: string;
    gap: string;
};
export declare function parseReviewFromText(raw: string, candidates: Candidate[], fallbackSummary: string, fallbackGap: string): CriterionReview;
export declare function normalizeReview(args: Record<string, unknown>, candidates: Candidate[], fallbackSummary: string, fallbackGap: string): CriterionReview;
export declare function isAcceptedVerdict(verdict: CriterionReview['verdicts'][number] | undefined): boolean;
export declare function criterionStatusFromReview(decision: ResearchVerification, acceptedCount: number): {
    status: ResearchCoverageStatus;
    reason: string;
};
export declare function questionStatusFromCoverage(criteria: readonly ResearchCriterion[], acceptedEvidenceCount: number): ResearchQuestion['status'];
export declare function deriveQuestionGaps(criteria: readonly ResearchCriterion[]): string[];
/** One limitation derived from a criterion that was not fully covered, or a project-level note. */
export interface ResearchLimitationRow {
    readonly questionId: ResearchQuestionId | '';
    readonly criterionId: string;
    readonly status: ResearchCoverageStatus | '';
    readonly text: string;
}
/** Turn partial / blocked / conflicted / still-missing criteria into limitation rows. */
export declare function deriveLimitationRows(project: Pick<ResearchProject, 'questions' | 'limitations'>): ResearchLimitationRow[];
export declare function collectLimitations(project: Pick<ResearchProject, 'questions' | 'limitations'>): string[];
export declare function buildScoutHandoff(question: ResearchQuestion, evidence: readonly ResearchEvidence[]): string;
export declare function evidenceSources(item: ResearchEvidence): Array<{
    url: string;
    snippet: string;
    artifactId?: string | undefined;
}>;
export declare function buildUpstreamDependencySummary(question: ResearchQuestion, evidence: readonly ResearchEvidence[]): string;
export declare function collectDependencyContext(question: ResearchQuestion, questions: readonly ResearchQuestion[], evidence: readonly ResearchEvidence[]): {
    text: string;
    waitingOn: ResearchQuestionId[];
};
export declare function isQuestionSettled(question: ResearchQuestion): boolean;
export declare function unresolvedDependencyIds(question: ResearchQuestion, questions: readonly ResearchQuestion[]): ResearchQuestionId[];
export declare function selectReadyWaveBatch(questions: readonly ResearchQuestion[], maxParallel?: number): {
    ready: ResearchQuestion[];
    waiting: Array<{
        question: ResearchQuestion;
        waitingOn: ResearchQuestionId[];
    }>;
};
/** Keep Scout/Evaluator draft panes for model prose; drop tool-log and JSON payloads. */
export declare function readableRoleDraft(text: string): string;
export declare function emptyProgress(): ResearchProgress;
export declare function emptyScoutProgress(questionId: ResearchQuestionId, extras?: Partial<ResearchScoutProgress>): ResearchScoutProgress;
export declare function mergeScoutProgress(progress: ResearchProgress, next: ResearchScoutProgress): ResearchProgress;
export declare function pushProgressTool(tools: readonly ResearchProgressTool[], tool: ResearchProgressTool): ResearchProgressTool[];
export declare function buildResearchWritingPack(project: ResearchProject): string;
//# sourceMappingURL=investigation.d.ts.map