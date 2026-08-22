/** Client mount for the deep-research Remote contribution. */
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client';
import type { TypertClientRemote } from '@deepseek-ai/dsh-typert-protocol';
export type {} from '@deepseek-ai/dsh-deepresearch/remote';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Generated Remote namespaces, including deep research. */
        remote: TypertClientRemote;
    }
}
/** Required services: the typed Remote client, conversation-view registry, and locale service. */
export declare const inject: string[];
/**
 * Mount the deep-research Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote, slot, and locale services.
 * @returns disposer after the namespace is ready.
 */
export declare function apply(ctx: ClientContext): Promise<() => Promise<void>>;
