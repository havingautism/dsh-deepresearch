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
import DeepResearch, { ResearchId } from '../src/index.ts'

const contexts: Context[] = []
const roots: string[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function harness(root?: string): Promise<Context> {
  const storageRoot = root ?? await mkdtemp(join(tmpdir(), 'dsh-deepresearch-test-'))
  if (root === undefined) roots.push(storageRoot)
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(Tools)
  await ctx.plugin(Storage)
  await ctx.plugin(StorageJson, { root: storageRoot })
  await ctx.plugin(StorageDomain, { backend: 'json' })
  await ctx.plugin(DeepResearch, {
    maxProjects: 2,
    maxEvidencePerProject: 2,
    maxReportChars: 80,
  })
  return ctx
}

describe('Deep Research extension', () => {
  it('publishes its Remote namespace and model Tool names without another extension', async () => {
    const ctx = await harness()
    expect(ctx.deepResearch.typertGateway.namespace).toBe('deepResearch')
    expect(remoteMethods(ctx.deepResearch).map(marker => marker.method)).toEqual([
      'list', 'get', 'start', 'addEvidence', 'complete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([
      'deep_research_start',
      'deep_research_add_evidence',
      'deep_research_complete',
      'deep_research_list',
    ])
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

  it('retains projects across a cold storage restart', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-restart-'))
    roots.push(root)
    const first = await harness(root)
    const research = await first.deepResearch.start({
      question: 'Will this survive?', depth: 'quick', plan: ['Restart'],
    })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.deepResearch.get({ id: research.id })?.question).toBe('Will this survive?')
    expect(second.deepResearch.get({ id: ResearchId('missing') })).toBeNull()
  })
})
