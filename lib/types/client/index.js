/** Client mount for the deep-research Remote contribution. */
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote';
import { hydrateResearchProject } from "./project-hydrate.js";
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
function createApi(clientRemote, deepResearch) {
    return {
        list: async (query) => remoteValue('deepResearch.list', await deepResearch.list({ ...(query === '' ? {} : { query }) })).projects.map(hydrateResearchProject),
        get: async (id) => {
            const project = remoteValue('deepResearch.get', await deepResearch.get({ id }));
            return project === null ? null : hydrateResearchProject(project);
        },
        start: async (request) => hydrateResearchProject(remoteValue('deepResearch.start', await deepResearch.start(request))),
        updatePlan: async (request) => hydrateResearchProject(remoteValue('deepResearch.updatePlan', await deepResearch.updatePlan(request))),
        confirmPlan: async (id) => hydrateResearchProject(remoteValue('deepResearch.confirmPlan', await deepResearch.confirmPlan({ id }))),
        complete: async (request) => hydrateResearchProject(remoteValue('deepResearch.complete', await deepResearch.complete(request))),
        fail: async (id, reason, aborted) => hydrateResearchProject(remoteValue('deepResearch.fail', await deepResearch.fail({ id, reason, aborted }))),
        resume: async (id) => hydrateResearchProject(remoteValue('deepResearch.resume', await deepResearch.resume({ id }))),
        writeReport: async (id) => hydrateResearchProject(remoteValue('deepResearch.writeReport', await deepResearch.writeReport({ id }))),
        delete: async (id) => remoteValue('deepResearch.delete', await deepResearch.delete({ id })),
        subscribeProgress: listener => clientRemote.$on('deepResearch/progress', (project) => { listener(hydrateResearchProject(project)); }),
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
    const view = ctx.inject(['remote.deepResearch', 'slots'], (remoteCtx) => {
        const api = createApi(ctx.remote, remoteCtx.remote.deepResearch);
        const face = () => ({ store, api });
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