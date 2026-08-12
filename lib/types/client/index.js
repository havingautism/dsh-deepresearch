/** Client mount for the deep-research Remote contribution. */
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote';
/** Required service: the Web profile's typed Remote client. */
export const inject = ['remote'];
/**
 * Mount the deep-research Remote namespace into the Web client.
 * @param ctx - Client Cordis root carrying the typed Remote service.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    return await ctx.remote.$mount(deepResearchRemote);
}
//# sourceMappingURL=index.js.map