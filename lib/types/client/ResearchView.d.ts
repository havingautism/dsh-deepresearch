/** Codemini-aligned Deep Research library and evidence workspace. */
import type { ResearchViewApi } from './view-types.ts';
import type { DeepResearchKey } from './locales.ts';
/** Props for the global Deep Research workspace surface. */
type ResearchViewProps = ResearchViewApi & {
    t: (key: DeepResearchKey, params?: Record<string, unknown>) => string;
};
/** Render the research library, editable plan, investigation evidence, and report. */
export declare function ResearchView({ t, ...api }: ResearchViewProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ResearchView.d.ts.map