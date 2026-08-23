/** Codemini-aligned Deep Research library, plan review, and live investigation workspace. */
import type { ResearchViewApi } from './view-types.ts';
import type { DeepResearchKey } from './locales.ts';
type Translate = (key: DeepResearchKey, params?: Record<string, unknown>) => string;
/** Props for the global Deep Research workspace surface. */
type ResearchViewProps = ResearchViewApi & {
    t: Translate;
    projectId?: string | null;
    onSelectProject?: (id: string | null) => void;
    onClose?: () => void;
};
/** Render the research library, reviewable plan, live investigation board, and report. */
export declare function ResearchView({ t, projectId, onSelectProject, onClose, ...api }: ResearchViewProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=ResearchView.d.ts.map