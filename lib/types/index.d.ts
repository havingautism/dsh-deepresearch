/**
 * Codemini-aligned Deep Research: planning Lead, serial/parallel Scouts, Evaluator, Writer.
 * @module @deepseek-ai/dsh-deepresearch
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol';
import type { ResearchCompleteRequest, ResearchConfirmRequest, ResearchDeleteRequest, ResearchDeleteResult, ResearchEvidenceRequest, ResearchFailRequest, ResearchGetRequest, ResearchListRequest, ResearchListResult, ResearchPlanUpdateRequest, ResearchProject, ResearchQuestionUpdateRequest, ResearchResumeRequest, ResearchStartRequest, ResearchWriteReportRequest } from './types.ts';
export type * from './types.ts';
export { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts';
export { deepResearchDomainSpec, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema } from './spec.ts';
export { defaultDeepResearchSqlitePath, defaultDeepResearchUnitPath, importJsonProjectsIfEmpty, migrateDeepResearchUnitFile, resolveDeepResearchUnitPath } from './migrate.ts';
export { assertPlanFitsDepth, inferResearchPlanDepth, planResearchBudget } from './budget.ts';
export { buildResearchWritingPack, gateCandidatesByUrl, normalizeQuery, normalizeSubmittedCandidates, normalizeUrl, parseCandidatesFromText, selectReadyWaveBatch, } from './investigation.ts';
/** Required project, evidence, and report limits. */
export interface Config {
    readonly runnerEnabled: boolean;
    readonly runnerCwd: string;
    readonly maxProjects: number;
    readonly maxQuestions: number;
    readonly maxCriteriaPerQuestion: number;
    readonly maxEvidencePerProject: number;
    readonly maxReportChars: number;
    /** Override JSON storages directory; defaults to `DSH_HOME/storages`. */
    readonly storageRoot?: string;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        deepResearch: DeepResearchService;
    }
}
/** Durable Codemini-style Deep Research project service. */
export declare class DeepResearchService extends TypertRemoteService {
    private readonly config;
    static inject: string[];
    static Config: s<Config>;
    private table?;
    private mutationTail;
    private readonly activeRuns;
    /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
    constructor(ctx: Context, config: Config);
    protected [Service.init](): Promise<void>;
    list(request: ResearchListRequest): ResearchListResult;
    get(request: ResearchGetRequest): ResearchProject | null;
    start(request: ResearchStartRequest): Promise<ResearchProject>;
    updatePlan(request: ResearchPlanUpdateRequest): Promise<ResearchProject>;
    confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject>;
    addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject>;
    updateQuestion(request: ResearchQuestionUpdateRequest): Promise<ResearchProject>;
    complete(request: ResearchCompleteRequest): Promise<ResearchProject>;
    fail(request: ResearchFailRequest): Promise<ResearchProject>;
    resume(request: ResearchResumeRequest): Promise<ResearchProject>;
    writeReport(request: ResearchWriteReportRequest): Promise<ResearchProject>;
    delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult>;
    private launch;
    private runPlanning;
    private runInvestigation;
    private runWritingPhase;
    private runScoutForQuestion;
    private runCriterion;
    private runEvaluator;
    private runWriting;
    private spawnRole;
    private markPaused;
    private stopRun;
    private reserveBudget;
    private buildQuestions;
    private require;
    private requireWeb;
    private update;
    private emitProgress;
    private enqueue;
    private requireTable;
}
export default DeepResearchService;
//# sourceMappingURL=index.d.ts.map