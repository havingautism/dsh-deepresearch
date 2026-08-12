/** Operations injected into the deep-research conversation view. */
import type { ResearchProject, ResearchStartRequest } from '../types.ts';
/** Research page operations over the package-owned Remote namespace. */
export interface ResearchViewApi {
    readonly list: (query: string) => Promise<readonly ResearchProject[]>;
    readonly start: (request: ResearchStartRequest) => Promise<ResearchProject>;
}
//# sourceMappingURL=view-types.d.ts.map