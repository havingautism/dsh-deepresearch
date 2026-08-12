/**
 * Evidence-first Deep Research workspace over existing Web and subagent Tools.
 * @module @deepseek-ai/dsh-deepresearch
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { GatewayService } from '@deepseek-ai/dsh-type-meta';
import type { ResearchCompleteRequest, ResearchConfirmRequest, ResearchDeleteRequest, ResearchDeleteResult, ResearchEvidenceRequest, ResearchFailRequest, ResearchGetRequest, ResearchListRequest, ResearchListResult, ResearchPlanUpdateRequest, ResearchProject, ResearchQuestionUpdateRequest, ResearchStartRequest } from './types.ts';
export type * from './types.ts';
export { ResearchEvidenceId, ResearchId, ResearchQuestionId } from './types.ts';
export { deepResearchDomainSpec, researchCriterionSchema, researchEvidenceSchema, researchProjectSchema, researchQuestionSchema } from './spec.ts';
/** Required project, evidence, and report limits. */
export interface Config {
    /** Maximum durable research projects. */
    readonly maxProjects: number;
    /** Maximum planned sub-questions in one project. */
    readonly maxQuestions: number;
    /** Maximum success criteria for one sub-question. */
    readonly maxCriteriaPerQuestion: number;
    /** Maximum source-backed evidence items in one project. */
    readonly maxEvidencePerProject: number;
    /** Maximum characters in a saved final report. */
    readonly maxReportChars: number;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        deepResearch: DeepResearchService;
    }
}
/** Durable Codemini-style Deep Research project service. */
export declare class DeepResearchService extends GatewayService {
    private readonly config;
    static inject: string[];
    static Config: s<Config>;
    private table?;
    private mutationTail;
    /** @param ctx - Host context carrying storage, prompt, and Tool registries. @param config - Project and content limits. */
    constructor(ctx: Context, config: Config);
    /** Open storage and publish workflow guidance and Tools. */
    protected [Service.init](): Promise<void>;
    /**
     * List projects matching optional text and phase filters.
     * @param request - optional project filters.
     * @returns matching projects ordered by newest edit.
     */
    list(request: ResearchListRequest): ResearchListResult;
    /**
     * Read one exact project.
     * @param request - project identity to read.
     * @returns detached project data, or null when absent.
     */
    get(request: ResearchGetRequest): ResearchProject | null;
    /**
     * Create a draft plan with sub-questions and success criteria.
     * @param request - research objective and initial question plan.
     * @returns the detached stored project.
     */
    start(request: ResearchStartRequest): Promise<ResearchProject>;
    /**
     * Replace an unconfirmed project plan.
     * @param request - replacement plan and project identity.
     * @returns the updated detached project.
     */
    updatePlan(request: ResearchPlanUpdateRequest): Promise<ResearchProject>;
    /**
     * Lock the plan and make the project ready for investigation.
     * @param request - project identity to confirm.
     * @returns the updated detached project.
     */
    confirmPlan(request: ResearchConfirmRequest): Promise<ResearchProject>;
    /**
     * Attach one source-backed claim to a planned sub-question.
     * @param request - evidence attribution and claim content.
     * @returns the updated detached project.
     */
    addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject>;
    /**
     * Update sub-question and criterion coverage after evidence review.
     * @param request - reviewed question progress and criteria.
     * @returns the updated detached project.
     */
    updateQuestion(request: ResearchQuestionUpdateRequest): Promise<ResearchProject>;
    /**
     * Save a final or explicitly partial report with conclusions and limitations.
     * @param request - report content and completion state.
     * @returns the completed detached project.
     */
    complete(request: ResearchCompleteRequest): Promise<ResearchProject>;
    /**
     * Record an aborted or failed investigation without losing evidence.
     * @param request - failure reason and termination type.
     * @returns the updated detached project.
     */
    fail(request: ResearchFailRequest): Promise<ResearchProject>;
    /**
     * Delete a project; absence is a stable successful outcome.
     * @param request - project identity to delete.
     * @returns whether the project existed.
     */
    delete(request: ResearchDeleteRequest): Promise<ResearchDeleteResult>;
    private registerTools;
    private buildQuestions;
    private update;
    private enqueue;
    private requireTable;
}
export default DeepResearchService;
//# sourceMappingURL=index.d.ts.map