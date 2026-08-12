/** Client mount for the deep-research Remote contribution. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import type { TypeRTClientRemote } from '@deepseek-ai/dsh-type-meta';
export type {} from '@deepseek-ai/dsh-deepresearch/remote';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Generated Remote namespaces, including deep research. */
        remote: TypeRTClientRemote;
    }
}
/** Required services: the typed Remote client and conversation-view registry. */
export declare const inject: string[];
/**
 * Mount the deep-research Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export declare function apply(ctx: ClientContext): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map