import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageJson from '@deepseek-ai/dsh-storage-json'
import { remoteMethods } from '@deepseek-ai/dsh-type-meta'
import Notebooks, { NotebookId } from '../../notebooks/src/index.ts'
import DeepResearch, { ResearchId } from '../src/index.ts'

const contexts: Context[] = []
const roots: string[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function harness(root?: string): Promise<Context> {
  const storageRoot = root ?? await mkdtemp(join(tmpdir(), 'dsh-extensions-test-'))
  if (root === undefined) roots.push(storageRoot)
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(Tools)
  await ctx.plugin(Storage)
  await ctx.plugin(StorageJson, { root: storageRoot })
  await ctx.plugin(StorageDomain, { backend: 'json' })
  await ctx.plugin(Notebooks, { maxEntries: 2, maxContentChars: 40 })
  await ctx.plugin(DeepResearch, {
    maxProjects: 2,
    maxEvidencePerProject: 2,
    maxReportChars: 80,
  })
  return ctx
}

describe('Notebooks and Deep Research extensions', () => {
  it('publishes exact Remote namespaces and model Tool names', async () => {
    const ctx = await harness()
    expect(ctx.notebooks.typertGateway.namespace).toBe('notebooks')
    expect(ctx.deepResearch.typertGateway.namespace).toBe('deepResearch')
    expect(remoteMethods(ctx.notebooks).map(marker => marker.method)).toEqual(['list', 'put', 'delete'])
    expect(remoteMethods(ctx.deepResearch).map(marker => marker.method)).toEqual([
      'list', 'get', 'start', 'addEvidence', 'complete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([
      'notebook_list',
      'notebook_write',
      'notebook_delete',
      'deep_research_start',
      'deep_research_add_evidence',
      'deep_research_complete',
      'deep_research_list',
    ])
  })

  it('creates, searches, updates, and deletes durable notebook entries', async () => {
    const ctx = await harness()
    const created = await ctx.notebooks.put({
      title: 'Renderer decisions',
      content: 'Rows derive state from durable blocks.',
      tags: ['ui', ' replay ', 'ui'],
    })
    expect(created.id).toMatch(/^note-/u)
    expect(created.tags).toEqual(['ui', 'replay'])
    expect(ctx.notebooks.list({ query: 'durable' }).entries).toEqual([created])
    expect(ctx.notebooks.list({ tag: 'REPLAY' }).entries).toEqual([created])

    const updated = await ctx.notebooks.put({
      id: created.id,
      title: 'Renderer contract',
      content: 'Replay uses the same logged block.',
    })
    expect(updated.createdAt).toBe(created.createdAt)
    expect(updated.title).toBe('Renderer contract')
    await expect(ctx.notebooks.delete({ id: created.id })).resolves.toEqual({ deleted: true })
    await expect(ctx.notebooks.delete({ id: created.id })).resolves.toEqual({ deleted: false })
  })

  it('enforces notebook limits before committing a mutation', async () => {
    const ctx = await harness()
    await expect(ctx.notebooks.put({ title: 'Blank', content: '   ' })).rejects.toThrow('content must not be blank')
    await expect(ctx.notebooks.put({ title: 'Long', content: 'x'.repeat(41) })).rejects.toThrow('exceeds 40')
    await ctx.notebooks.put({ title: 'One', content: '1' })
    await ctx.notebooks.put({ title: 'Two', content: '2' })
    await expect(ctx.notebooks.put({ title: 'Three', content: '3' })).rejects.toThrow('entry limit 2')
  })

  it('moves research from planning through evidence to a final report', async () => {
    const ctx = await harness()
    const started = await ctx.deepResearch.start({
      question: 'How should tool rows replay?',
      depth: 'deep',
      plan: ['Read the event contract', 'Compare live and replay output'],
    })
    expect(started).toMatchObject({ phase: 'planning', evidence: [], report: null })

    const investigating = await ctx.deepResearch.addEvidence({
      id: started.id,
      source: 'Tool UI contract',
      url: 'https://example.test/tool-ui',
      summary: 'Presentation is a pure function of logged arguments and results.',
    })
    expect(investigating.phase).toBe('researching')
    expect(investigating.evidence).toHaveLength(1)
    const complete = await ctx.deepResearch.complete({
      id: started.id,
      report: 'Use logged call/result data and avoid live catalog reads.',
    })
    expect(complete.phase).toBe('complete')
    expect(ctx.deepResearch.list({ phase: 'complete' }).projects).toEqual([complete])
    await expect(ctx.deepResearch.addEvidence({
      id: started.id,
      source: 'Late source',
      summary: 'Should be rejected.',
    })).rejects.toThrow('is complete')
  })

  it('retains notebook and research records across a cold storage restart', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-extensions-restart-'))
    roots.push(root)
    const first = await harness(root)
    const note = await first.notebooks.put({ title: 'Persistent', content: 'Across contexts' })
    const research = await first.deepResearch.start({
      question: 'Will this survive?', depth: 'quick', plan: ['Restart'],
    })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.notebooks.list({}).entries.map(entry => entry.id)).toEqual([note.id])
    expect(second.deepResearch.get({ id: research.id })?.question).toBe('Will this survive?')
    expect(second.deepResearch.get({ id: ResearchId('missing') })).toBeNull()
    expect(second.notebooks.list({ query: 'no-match' }).entries).toEqual([])
    expect(second.notebooks.list({ tag: 'no-match' }).entries).toEqual([])
    await expect(second.notebooks.delete({ id: NotebookId('missing') })).resolves.toEqual({ deleted: false })
  })
})
