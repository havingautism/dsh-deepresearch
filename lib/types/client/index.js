/** Client mount for the deep-research Remote contribution. */
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote';
import { ResearchView } from "./ResearchView.js";
/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots'];
/** Return one successful Remote value or surface the carrier failure. */
function remoteValue(operation, result) {
    if (!result.ok) {
        throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
    }
    return result.value;
}
/**
 * Mount the deep-research Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    const disposeRemote = await ctx.remote.$mount(deepResearchRemote);
    ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'deepresearch',
        order: 30,
        label: () => '深度研究',
        inject: () => ({
            list: async (query) => remoteValue('deepResearch.list', await ctx.remote.deepResearch.list({ ...(query === '' ? {} : { query }) })).projects,
            get: async (id) => remoteValue('deepResearch.get', await ctx.remote.deepResearch.get({ id })),
            start: async (request) => remoteValue('deepResearch.start', await ctx.remote.deepResearch.start(request)),
            updatePlan: async (request) => remoteValue('deepResearch.updatePlan', await ctx.remote.deepResearch.updatePlan(request)),
            confirmPlan: async (id) => remoteValue('deepResearch.confirmPlan', await ctx.remote.deepResearch.confirmPlan({ id })),
            complete: async (request) => remoteValue('deepResearch.complete', await ctx.remote.deepResearch.complete(request)),
            fail: async (id, reason, aborted) => remoteValue('deepResearch.fail', await ctx.remote.deepResearch.fail({ id, reason, aborted })),
            delete: async (id) => remoteValue('deepResearch.delete', await ctx.remote.deepResearch.delete({ id })),
        }),
    }, ResearchView));
    return disposeRemote;
}
//# sourceMappingURL=index.js.map