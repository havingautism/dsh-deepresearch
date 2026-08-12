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
            start: async (request) => await ctx.remote.deepResearch.start(request),
        }),
    }, ResearchView));
    return disposeRemote;
}
//# sourceMappingURL=index.js.map