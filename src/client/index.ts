/** Client mount for the deep-research Remote contribution. */

import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import deepResearchRemote from '@deepseek-ai/dsh-deepresearch/remote'
import type { RemoteResult, TypertClientRemote } from '@deepseek-ai/dsh-typert-protocol'
import type { ResearchDeleteResult, ResearchProject, ResearchStartRequest } from '../types.ts'
import { ResearchView } from './ResearchView.tsx'
import type { ResearchViewApi } from './view-types.ts'

export type {} from '@deepseek-ai/dsh-deepresearch/remote'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Generated Remote namespaces, including deep research. */
    remote: TypertClientRemote
  }
}

/** Required services: the typed Remote client and conversation-view registry. */
export const inject = ['remote', 'slots']

/** Return one successful Remote value or surface the carrier failure. */
function remoteValue<T>(operation: string, result: RemoteResult<T>): T {
  if (!result.ok) {
    throw new Error(`${operation} failed: ${result.error.code}: ${result.error.message}`)
  }
  return result.value
}

/**
 * Mount the deep-research Remote namespace and its conversation view.
 * @param ctx - Web client root carrying Remote and slot services.
 * @returns disposer after the namespace is ready.
 */
export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  const disposeRemote = await ctx.remote.$mount(deepResearchRemote)
  const view = ctx.inject(['remote.deepResearch'], (remoteCtx) => {
    remoteCtx.slots.inject('conversation.view', () => remoteCtx.slots.register({
      name: 'conversation.view',
      id: 'deepresearch',
      order: 30,
      label: () => '深度研究',
      inject: (): ResearchViewApi => ({
        list: async query => remoteValue('deepResearch.list', await remoteCtx.remote.deepResearch.list({ ...(query === '' ? {} : { query }) })).projects,
        get: async id => remoteValue('deepResearch.get', await remoteCtx.remote.deepResearch.get({ id })),
        start: async (request: ResearchStartRequest): Promise<ResearchProject> => remoteValue('deepResearch.start', await remoteCtx.remote.deepResearch.start(request)),
        updatePlan: async request => remoteValue('deepResearch.updatePlan', await remoteCtx.remote.deepResearch.updatePlan(request)),
        confirmPlan: async id => remoteValue('deepResearch.confirmPlan', await remoteCtx.remote.deepResearch.confirmPlan({ id })),
        complete: async request => remoteValue('deepResearch.complete', await remoteCtx.remote.deepResearch.complete(request)),
        fail: async (id, reason, aborted) => remoteValue('deepResearch.fail', await remoteCtx.remote.deepResearch.fail({ id, reason, aborted })),
        delete: async (id): Promise<ResearchDeleteResult> => remoteValue('deepResearch.delete', await remoteCtx.remote.deepResearch.delete({ id })),
      }),
    }, ResearchView))
  })
  await view
  return async () => {
    await view.dispose()
    await disposeRemote()
  }
}
