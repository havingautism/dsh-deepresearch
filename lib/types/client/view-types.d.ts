/** Operations injected into the Deep Research conversation view. */
import type { ResearchCompleteRequest, ResearchDeleteResult, ResearchId, ResearchPlanUpdateRequest, ResearchProject, ResearchStartRequest } from '../types.ts';
/** Research workspace operations over the package-owned Remote namespace. */
export interface ResearchViewApi {
    readonly list: (query: string) => Promise<readonly ResearchProject[]>;
    readonly get: (id: ResearchId) => Promise<ResearchProject | null>;
    readonly start: (request: ResearchStartRequest) => Promise<ResearchProject>;
    readonly updatePlan: (request: ResearchPlanUpdateRequest) => Promise<ResearchProject>;
    readonly confirmPlan: (id: ResearchId) => Promise<ResearchProject>;
    readonly complete: (request: ResearchCompleteRequest) => Promise<ResearchProject>;
    readonly fail: (id: ResearchId, reason: string, aborted: boolean) => Promise<ResearchProject>;
    readonly resume: (id: ResearchId) => Promise<ResearchProject>;
    readonly writeReport: (id: ResearchId) => Promise<ResearchProject>;
    readonly delete: (id: ResearchId) => Promise<ResearchDeleteResult>;
    /** Subscribe to live project pushes; returns an unsubscribe disposer. */
    readonly subscribeProgress: (listener: (project: ResearchProject) => void) => () => void;
}
//# sourceMappingURL=view-types.d.ts.map