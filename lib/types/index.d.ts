/**
 * Durable evidence-first deep-research workflow over existing web and subagent tools.
 * @module @deepseek-ai/dsh-deepresearch
 */
import { Context, Service } from '@deepseek-ai/cordis';
import s from '@deepseek-ai/schemastery';
import { GatewayService } from '@deepseek-ai/dsh-type-meta';
import type { ResearchCompleteRequest, ResearchEvidenceRequest, ResearchGetRequest, ResearchListRequest, ResearchListResult, ResearchProject, ResearchStartRequest } from './types.ts';
export type * from './types.ts';
export { ResearchId } from './types.ts';
export { deepResearchDomainSpec, researchEvidenceSchema, researchProjectSchema } from './spec.ts';
/** Required project, evidence, and report limits. */
export interface Config {
    readonly maxProjects: number;
    readonly maxEvidencePerProject: number;
    readonly maxReportChars: number;
}
declare module '@deepseek-ai/cordis' {
    interface Context {
        deepResearch: DeepResearchService;
    }
}
/** Deep-research project service. */
export declare class DeepResearchService extends GatewayService {
    private readonly config;
    static inject: string[];
    /** Loader validation for deployment-varying research limits. */
    static Config: s<Config>;
    private table?;
    private mutationTail;
    /**
     * @param ctx - Host context carrying storage, prompt, and tool registries.
     * @param config - Project and content limits.
     */
    constructor(ctx: Context, config: Config);
    /** Open storage and publish workflow guidance and tools. */
    protected [Service.init](): Promise<void>;
    /** List projects matching optional text and phase filters. */
    list(request: ResearchListRequest): ResearchListResult;
    /** Read one exact project. */
    get(request: ResearchGetRequest): ResearchProject | null;
    /** Create a project with a non-empty investigation plan. */
    start(request: ResearchStartRequest): Promise<ResearchProject>;
    /** Attach one finding and move the project into active investigation. */
    addEvidence(request: ResearchEvidenceRequest): Promise<ResearchProject>;
    /** Save the final synthesis and close the project. */
    complete(request: ResearchCompleteRequest): Promise<ResearchProject>;
    /** Register model-facing workflow tools over the service. */
    private registerTools;
    private enqueue;
    private requireTable;
}
export default DeepResearchService;
//# sourceMappingURL=index.d.ts.map