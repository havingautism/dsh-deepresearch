/** Sidebar foot control that opens the global Deep Research workspace. */
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { DeepResearchClientFace } from './client-face.ts';
type DeepResearchSidebarEntryProps = PropsRuntime<'sidebar.footer.action'> & InjectFace<DeepResearchClientFace> & PropsLocale<'deepresearch'>;
/** Render the sidebar launch button for the frame-wide research overlay. */
export declare function DeepResearchSidebarEntry({ wide, t, ...face }: DeepResearchSidebarEntryProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=DeepResearchSidebarEntry.d.ts.map