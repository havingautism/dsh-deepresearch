/** Client mount for the deep-research Remote contribution. */
import type { Context } from '@deepseek-ai/cordis';
import type { TypeRTClientRemote } from '@deepseek-ai/dsh-type-meta';
export type {} from '@deepseek-ai/dsh-deepresearch/remote';
declare module '@deepseek-ai/cordis' {
    interface Context {
        /** Generated Remote namespaces, including deep research. */
        remote: TypeRTClientRemote;
    }
}
/** Required service: the Web profile's typed Remote client. */
export declare const inject: string[];
/**
 * Mount the deep-research Remote namespace into the Web client.
 * @param ctx - Client Cordis root carrying the typed Remote service.
 * @returns disposer after the namespace is ready.
 */
export declare function apply(ctx: Context): Promise<() => Promise<void>>;
//# sourceMappingURL=index.d.ts.map