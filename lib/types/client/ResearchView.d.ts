/** Codemini-aligned Deep Research library and evidence workspace. */
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client';
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots';
import type { ResearchViewApi } from './view-types.ts';
import type { DeepResearchKey } from './locales.ts';
/**
 * Composed props: owner conversation-view share + the registered business
 * face (the research API) + the framework-injected locale `t` seat (declared
 * via `locale: NS` on the slot registration).
 */
type ResearchViewProps = ConvViewProps & InjectFace<ResearchViewApi> & {
    t: (key: DeepResearchKey, params?: Record<string, unknown>) => string;
};
/** Render the research library, editable plan, investigation evidence, and report. */
export declare function ResearchView({ t, ...api }: ResearchViewProps): import("react").JSX.Element;
export {};
