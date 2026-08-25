import { describe, expect, it, vi } from 'vitest'
import type { ClientContext } from '@deepseek-ai/dsh-client-runtime/client'
import { apply } from '../src/client/index.ts'
import { createDeepResearchUiStore, readDeepResearchRoute } from '../src/client/ui-store.ts'
import type { ResearchViewApi } from '../src/client/view-types.ts'

describe('Deep Research client mount', () => {
  it('registers sidebar and overlay surfaces inside the mounted Remote namespace scope', async () => {
    const list = vi.fn(async () => ({ ok: true as const, value: { projects: [] } }))
    let injectFace: (() => { api: ResearchViewApi }) | undefined
    const injected: string[] = []
    const disposeEntry = vi.fn()
    const disposeView = vi.fn(async () => undefined)
    const disposeRemote = vi.fn(async () => undefined)
    const view = Object.assign(Promise.resolve(), { dispose: disposeView })
    const remoteCtx = {
      remote: {
        deepResearch: { list },
        $on: vi.fn(() => () => undefined),
      },
      slots: {
        inject: (key: string, callback: () => unknown) => {
          injected.push(key)
          callback()
          return disposeEntry
        },
        register: (options: { inject: () => { api: ResearchViewApi } }) => {
          injectFace = options.inject
          return disposeEntry
        },
      },
    }
    const ctx = {
      remote: { $mount: vi.fn(async () => disposeRemote) },
      locale: {
        register: vi.fn(() => vi.fn()),
        bind: vi.fn(() => (key: string) => key),
      },
      effect: (callback: () => unknown) => callback(),
      inject: (deps: readonly string[], callback: (scope: typeof remoteCtx) => void) => {
        expect(deps).toEqual(['remote.deepResearch', 'slots'])
        callback(remoteCtx)
        return view
      },
    }

    const dispose = await apply(ctx as unknown as ClientContext)
    expect(injected).toEqual(['sidebar.footer.action', 'shell.overlay'])
    expect(injectFace).toBeTypeOf('function')
    await expect(injectFace?.().api.list('')).resolves.toEqual([])
    expect(list).toHaveBeenCalledWith({})
    await dispose()
    expect(disposeView).toHaveBeenCalledOnce()
    expect(disposeRemote).toHaveBeenCalledOnce()
  })
})

describe('Deep Research overlay route', () => {
  it('reads library and project hashes', () => {
    expect(readDeepResearchRoute('')).toEqual({ open: false, projectId: null })
    expect(readDeepResearchRoute('#deepresearch')).toEqual({ open: true, projectId: null })
    expect(readDeepResearchRoute('#deepresearch/research-1')).toEqual({ open: true, projectId: 'research-1' })
  })

  it('opens the overlay and selects a project from setProjectId', () => {
    const store = createDeepResearchUiStore()
    expect(store.getOpen()).toBe(false)
    store.setProjectId('research-42')
    expect(store.getOpen()).toBe(true)
    expect(store.getProjectId()).toBe('research-42')
  })

  it('restores the project id from the hash when opening the overlay', () => {
    window.location.hash = '#deepresearch/research-from-hash'
    const store = createDeepResearchUiStore()
    expect(store.getOpen()).toBe(true)
    expect(store.getProjectId()).toBe('research-from-hash')
    store.setOpen(false)
    window.location.hash = '#deepresearch/research-from-hash'
    store.setOpen(true)
    expect(store.getOpen()).toBe(true)
    expect(store.getProjectId()).toBe('research-from-hash')
    window.location.hash = ''
  })

  it('syncs store state when the hash changes externally', () => {
    const store = createDeepResearchUiStore()
    window.location.hash = '#deepresearch/research-sync'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(store.getOpen()).toBe(true)
    expect(store.getProjectId()).toBe('research-sync')
    window.location.hash = ''
    window.dispatchEvent(new HashChangeEvent('hashchange'))
    expect(store.getOpen()).toBe(false)
    expect(store.getProjectId()).toBe(null)
  })
})
