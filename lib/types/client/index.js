/** Client mount for the deep-research Remote contribution. */
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote';
import { ResearchView } from "./ResearchView.js";
/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots'];
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
            list: async (query) => (await ctx.remote.deepResearch.list({ ...(query === '' ? {} : { query }) })).projects,
            get: async (id) => await ctx.remote.deepResearch.get({ id }),
            start: async (request) => await ctx.remote.deepResearch.start(request),
            updatePlan: async (request) => await ctx.remote.deepResearch.updatePlan(request),
            confirmPlan: async (id) => await ctx.remote.deepResearch.confirmPlan({ id }),
            complete: async (request) => await ctx.remote.deepResearch.complete(request),
            fail: async (id, reason, aborted) => await ctx.remote.deepResearch.fail({ id, reason, aborted }),
            delete: async (id) => await ctx.remote.deepResearch.delete({ id }),
        }),
    }, ResearchView));
    return disposeRemote;
}
//# sourceMappingURL=index.js.map