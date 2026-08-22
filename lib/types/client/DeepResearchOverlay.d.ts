/** Frame-wide overlay hosting the Deep Research library and workspace. */
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots';
import type { DeepResearchClientFace } from './client-face.ts';
type DeepResearchOverlayProps = InjectFace<DeepResearchClientFace> & PropsLocale<'deepresearch'>;
/** Render the research workspace when the sidebar entry opens the overlay. */
export declare function DeepResearchOverlay({ t, ...face }: DeepResearchOverlayProps): import("react").JSX.Element | null;
export {};
//# sourceMappingURL=DeepResearchOverlay.d.ts.map