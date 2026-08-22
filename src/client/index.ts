/** Client mount for the deep-research Remote contribution. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote'
import type { RemoteResult, TypertClientRemote } from '@deepseek-ai/dsh-typert-protocol'
import type { ResearchDeleteResult, ResearchProject, ResearchStartRequest } from '../types.ts'
import { NS, en, zh } from './locales.ts'
import type { ResearchViewApi } from './view-types.ts'
import type { DeepResearchClientFace } from './client-face.ts'
import { createDeepResearchUiStore } from './ui-store.ts'
import { DeepResearchSidebarEntry } from './DeepResearchSidebarEntry.tsx'
import { DeepResearchOverlay } from './DeepResearchOverlay.tsx'

export type {} from '@deepseek-ai/dsh-deepresearch/remote'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Generated Remote namespaces, including deep research. */
    remote: TypertClientRemote
  }
}

/** Required services: the typed Remote client, slot registry, and locale service. */
export const inject = ['remote', 'slots', 'locale']

/** Return one successful Remote value or surface the carrier failure. */
function remoteValue<T>(operation: string, result: RemoteResult<T>): T {
  if (!result.ok) {
    throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`)
  }
  return result.value
}

function createApi(remoteCtx: { remote: { deepResearch: TypertClientRemote['deepResearch'] } }): ResearchViewApi {
  return {
    list: async query => remoteValue('deepResearch.list', await remoteCtx.remote.deepResearch.list({ ...(query === '' ? {} : { query }) })).projects,
    get: async id => remoteValue('deepResearch.get', await remoteCtx.remote.deepResearch.get({ id })),
    start: async (request: ResearchStartRequest): Promise<ResearchProject> => remoteValue('deepResearch.start', await remoteCtx.remote.deepResearch.start(request)),
    updatePlan: async request => remoteValue('deepResearch.updatePlan', await remoteCtx.remote.deepResearch.updatePlan(request)),
    confirmPlan: async id => remoteValue('deepResearch.confirmPlan', await remoteCtx.remote.deepResearch.confirmPlan({ id })),
    complete: async request => remoteValue('deepResearch.complete', await remoteCtx.remote.deepResearch.complete(request)),
    fail: async (id, reason, aborted) => remoteValue('deepResearch.fail', await remoteCtx.remote.deepResearch.fail({ id, reason, aborted })),
    delete: async (id): Promise<ResearchDeleteResult> => remoteValue('deepResearch.delete', await remoteCtx.remote.deepResearch.delete({ id })),
  }
}

/**
 * Mount the deep-research Remote namespace and its global sidebar/overlay surfaces.
 * @param ctx - Web client root carrying Remote, slot, and locale services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(deepResearchRemote)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'deepresearch: dictionaries')
  const store = createDeepResearchUiStore()
  const view = ctx.inject(['remote.deepResearch'], (remoteCtx) => {
    const face = (): DeepResearchClientFace => ({ store, api: createApi(remoteCtx) })
    remoteCtx.slots.inject('sidebar.footer.action', () => remoteCtx.slots.register({
      name: 'sidebar.footer.action',
      id: 'deepresearch',
      order: 20,
      locale: NS,
      inject: face,
    }, DeepResearchSidebarEntry))
    remoteCtx.slots.inject('shell.overlay', () => remoteCtx.slots.register({
      name: 'shell.overlay',
      id: 'deepresearch',
      order: 20,
      locale: NS,
      inject: face,
    }, DeepResearchOverlay))
  })
  await view
  return async () => {
    await view.dispose()
    await disposeRemote()
  }
}
