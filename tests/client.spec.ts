import { describe, expect, it, vi } from 'vitest'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { apply } from '../src/client/index.ts'
import type { ResearchViewApi } from '../src/client/view-types.ts'

describe('Deep Research client mount', () => {
  it('registers the view inside the dynamically mounted Remote namespace scope', async () => {
    const list = vi.fn(async () => ({ ok: true as const, value: { projects: [] } }))
    let injectFace: (() => ResearchViewApi) | undefined
    const disposeEntry = vi.fn()
    const disposeView = vi.fn(async () => undefined)
    const disposeRemote = vi.fn(async () => undefined)
    const view = Object.assign(Promise.resolve(), { dispose: disposeView })
    const remoteCtx = {
      remote: { deepResearch: { list } },
      slots: {
        inject: (_key: string, callback: () => unknown) => callback(),
        register: (options: { inject: () => ResearchViewApi }) => {
          injectFace = options.inject
          return disposeEntry
        },
      },
    }
    const ctx = {
      remote: { $mount: vi.fn(async () => disposeRemote) },
      inject: (deps: readonly string[], callback: (scope: typeof remoteCtx) => void) => {
        expect(deps).toEqual(['remote.deepResearch'])
        callback(remoteCtx)
        return view
      },
    }

    const dispose = await apply(ctx as unknown as ClientContext)
    expect(injectFace).toBeTypeOf('function')
    await expect(injectFace?.().list('')).resolves.toEqual([])
    expect(list).toHaveBeenCalledWith({})
    await dispose()
    expect(disposeView).toHaveBeenCalledOnce()
    expect(disposeRemote).toHaveBeenCalledOnce()
  })
})
