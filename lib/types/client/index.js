/** Client mount for the deep-research Remote contribution. */
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote';
import { NS, en, zh } from "./locales.js";
import { createDeepResearchUiStore } from "./ui-store.js";
import { DeepResearchSidebarEntry } from "./DeepResearchSidebarEntry.js";
import { DeepResearchOverlay } from "./DeepResearchOverlay.js";
/** Required services: the typed Remote client, slot registry, and locale service. */
export const inject = ['remote', 'slots', 'locale'];
/** Return one successful Remote value or surface the carrier failure. */
function remoteValue(operation, result) {
    if (!result.ok) {
        throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`);
    }
    return result.value;
}
function createApi(remoteCtx) {
    return {
        list: async (query) => remoteValue('deepResearch.list', await remoteCtx.remote.deepResearch.list({ ...(query === '' ? {} : { query }) })).projects,
        get: async (id) => remoteValue('deepResearch.get', await remoteCtx.remote.deepResearch.get({ id })),
        start: async (request) => remoteValue('deepResearch.start', await remoteCtx.remote.deepResearch.start(request)),
        updatePlan: async (request) => remoteValue('deepResearch.updatePlan', await remoteCtx.remote.deepResearch.updatePlan(request)),
        confirmPlan: async (id) => remoteValue('deepResearch.confirmPlan', await remoteCtx.remote.deepResearch.confirmPlan({ id })),
        complete: async (request) => remoteValue('deepResearch.complete', await remoteCtx.remote.deepResearch.complete(request)),
        fail: async (id, reason, aborted) => remoteValue('deepResearch.fail', await remoteCtx.remote.deepResearch.fail({ id, reason, aborted })),
        delete: async (id) => remoteValue('deepResearch.delete', await remoteCtx.remote.deepResearch.delete({ id })),
    };
}
/**
 * Mount the deep-research Remote namespace and its global sidebar/overlay surfaces.
 * @param ctx - Web client root carrying Remote, slot, and locale services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx) {
    const disposeRemote = await ctx.remote.$mount(deepResearchRemote);
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'deepresearch: dictionaries');
    const store = createDeepResearchUiStore();
    const view = ctx.inject(['remote.deepResearch'], (remoteCtx) => {
        const face = () => ({ store, api: createApi(remoteCtx) });
        remoteCtx.slots.inject('sidebar.footer.action', () => remoteCtx.slots.register({
            name: 'sidebar.footer.action',
            id: 'deepresearch',
            order: 20,
            locale: NS,
            inject: face,
        }, DeepResearchSidebarEntry));
        remoteCtx.slots.inject('shell.overlay', () => remoteCtx.slots.register({
            name: 'shell.overlay',
            id: 'deepresearch',
            order: 20,
            locale: NS,
            inject: face,
        }, DeepResearchOverlay));
    });
    await view;
    return async () => {
        await view.dispose();
        await disposeRemote();
    };
}
//# sourceMappingURL=index.js.map