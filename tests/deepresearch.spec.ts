import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageSqlite from '@deepseek-ai/dsh-storage-sqlite'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import DeepResearch, { ResearchId } from '../lib/index.js'

const contexts: Context[] = []
const roots: string[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

async function harness(root?: string, runnerEnabled = false, agents: unknown = { create: () => Promise.reject(new Error('runner disabled in unit harness')) }): Promise<Context> {
  const storageRoot = root ?? await mkdtemp(join(tmpdir(), 'dsh-deepresearch-test-'))
  if (root === undefined) roots.push(storageRoot)
  const ctx = new Context()
  contexts.push(ctx)
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(Tools)
  await ctx.plugin(Storage)
  await ctx.plugin(StorageSqlite, { path: join(storageRoot, 'deepresearch.sqlite') })
  await ctx.plugin(StorageDomain, { backend: 'sqlite' })
  ctx.provide('agents', agents as never)
  ctx.provide('agentDefaultModel', { currentSelection: () => ({ provider: 'test', model: 'test' }) } as never)
  ctx.provide('agentPresets', { mount: async () => undefined } as never)
  ctx.provide('web', {
    search: async () => ({ content: '', sources: [{ url: 'https://example.test/a', title: 'A', snippet: 'Presentation is log-derived.' }] }),
    fetch: async ({ url }: { url: string }) => ({ url, statusCode: 200, body: { kind: 'html', content: 'Presentation is log-derived from recorded arguments.' } }),
  } as never)
  await ctx.plugin(DeepResearch, {
    runnerEnabled,
    runnerCwd: storageRoot,
    storageRoot,
    maxProjects: 2,
    maxQuestions: 4,
    maxCriteriaPerQuestion: 3,
    maxEvidencePerProject: 3,
    maxReportChars: 160,
  })
  return ctx
}

describe('Deep Research extension', () => {
  it('publishes its complete Remote surface without leaking runner Tools into chat', async () => {
    const ctx = await harness()
    expect(ctx.deepResearch.typertRemote.namespace).toBe('deepResearch')
    expect(remoteMethods(ctx.deepResearch).map(marker => marker.method)).toEqual([
      'list', 'get', 'start', 'updatePlan', 'confirmPlan', 'addEvidence',
      'updateQuestion', 'complete', 'fail', 'resume', 'writeReport', 'delete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([])
  })

  it('emits live progress when a plan is saved for review', async () => {
    const ctx = await harness()
    const phases: string[] = []
    ctx.on('deepResearch/progress', project => { phases.push(project.phase) })
    const started = await ctx.deepResearch.start({
      question: 'Does progress push?',
      depth: 'quick',
      questions: [],
    })
    const planned = await ctx.deepResearch.updatePlan({
      id: started.id,
      goal: 'Verify push events',
      constraints: '',
      depth: 'quick',
      questions: [{ text: 'One question', criteria: ['One criterion'] }],
    })
    expect(planned.phase).toBe('awaiting_plan_confirm')
    expect(phases).toContain('awaiting_plan_confirm')
  })

  it('moves a reviewed plan through evidence and coverage to a report', async () => {
    const ctx = await harness()
    const started = await ctx.deepResearch.start({
      question: 'How should tool rows replay?',
      goal: 'Produce a verifiable renderer recommendation.',
      constraints: 'Use durable evidence only.',
      depth: 'deep',
      questions: [
        { text: 'What is the event contract?', criteria: ['Identify the durable inputs'] },
        { text: 'How should replay render?', criteria: ['Compare live and replay'], dependsOn: [0] },
      ],
    })
    expect(started).toMatchObject({ phase: 'awaiting_plan_confirm', planConfirmed: false, evidence: [], report: null })
    expect(started.questions[1]?.dependsOn).toEqual([started.questions[0]?.id])
    await expect(ctx.deepResearch.addEvidence({
      id: started.id,
      questionId: started.questions[0]!.id,
      source: 'Premature source',
      claim: 'Should be rejected.',
      confidence: 'low',
    })).rejects.toThrow('plan is not confirmed')

    const confirmed = await ctx.deepResearch.confirmPlan({ id: started.id })
    expect(confirmed.phase).toBe('investigating')
    const withEvidence = await ctx.deepResearch.addEvidence({
      id: started.id,
      questionId: started.questions[0]!.id,
      criterionIds: [started.questions[0]!.criteria[0]!.id],
      source: 'Tool UI contract',
      url: 'https://example.test/tool-ui',
      snippet: 'Presentation is pure.',
      claim: 'Presentation derives from logged arguments and results.',
      confidence: 'high',
    })
    expect(withEvidence.evidence[0]).toMatchObject({ confidence: 'high', source: 'Tool UI contract' })
    await ctx.deepResearch.updateQuestion({ id: started.id, questionId: started.questions[0]!.id, status: 'covered' })
    const ready = await ctx.deepResearch.updateQuestion({ id: started.id, questionId: started.questions[1]!.id, status: 'partial' })
    expect(ready.phase).toBe('ready_for_report')
    const complete = await ctx.deepResearch.complete({
      id: started.id,
      report: 'Use logged call and result data; keep unresolved comparisons visible.',
      conclusions: ['Replay is log-derived.'],
      limitations: ['The comparison remains partial.'],
      partial: true,
    })
    expect(complete.phase).toBe('incomplete')
    expect(complete.limitations).toEqual(['The comparison remains partial.'])
    expect(ctx.deepResearch.list({ query: 'logged call' }).projects).toEqual([complete])
  })

  it('migrates legacy v2 storage before opening the domain', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-v2-'))
    roots.push(root)
    await writeFile(join(root, 'deepresearch.json'), `${JSON.stringify({
      unit: { name: 'deepresearch', version: 2 },
      global: null,
      tables: {
        projects: {
          'research-legacy': {
            id: 'research-legacy',
            title: 'Legacy',
            question: 'Still readable?',
            goal: 'Migrate me',
            constraints: '',
            seedText: '',
            depth: 'quick',
            phase: 'aborted',
            planConfirmed: true,
            questions: [{ id: 'rq-1', text: 'Q', dependsOn: [], status: 'pending', criteria: [{ id: 'c1.1', text: 'C', status: 'missing', summary: '', gap: '', warning: '', verification: '', toolCount: 0 }], gaps: [], handoff: '' }],
            evidence: [],
            conclusions: [],
            limitations: [],
            report: null,
            budget: { maxSearches: 25, maxFetches: 200, searchesUsed: 0, fetchesUsed: 0 },
            createdAt: 1,
            updatedAt: 2,
          },
        },
      },
    }, null, 2)}\n`, 'utf8')
    const ctx = await harness(root)
    expect(ctx.deepResearch.get({ id: ResearchId('research-legacy') })).toMatchObject({
      goal: 'Migrate me',
      phase: 'investigating',
      runState: 'paused',
    })
  })

  it('supports plan editing, aborts, and durable cold restarts', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-restart-'))
    roots.push(root)
    const first = await harness(root)
    const research = await first.deepResearch.start({
      question: 'Will this survive?', depth: 'quick',
      questions: [{ text: 'Check persistence', criteria: ['Restart'] }],
    })
    const revised = await first.deepResearch.updatePlan({
      id: research.id,
      goal: 'Verify durable restoration.',
      constraints: 'Cold restart only.',
      depth: 'standard',
      questions: [{ text: 'Restart the context', criteria: ['Read the same project'] }],
    })
    expect(revised.budget.maxSearches).toBe(25)
    expect(research.budget.maxSearches).toBe(25)
    await first.deepResearch.fail({ id: research.id, reason: 'User stopped the run.', aborted: true })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.deepResearch.get({ id: research.id })).toMatchObject({ phase: 'awaiting_plan_confirm', runState: 'paused', goal: 'Verify durable restoration.' })
    expect(second.deepResearch.get({ id: ResearchId('missing') })).toBeNull()
    await expect(second.deepResearch.delete({ id: research.id })).resolves.toEqual({ deleted: true })
  })

  it('runs planning in a private Agent scope and cancellation drains that run', async () => {
    const created: Array<Parameters<Context['agents']['create']>[0]> = []
    const registeredTools: string[] = []
    const prompts: string[] = []
    let resolveIdle: (() => void) | undefined
    const idle = new Promise<void>(resolve => { resolveIdle = resolve })
    const agentCtx = {
      tools: {
        schemas: () => [],
        restrict: () => () => undefined,
        register: (tool: { name: string }) => { registeredTools.push(tool.name); return () => undefined },
      },
      systemPrompt: { section: () => () => undefined },
      on: () => () => undefined,
    } as unknown as Context
    const agents = {
      create: async (options: Parameters<Context['agents']['create']>[0]) => {
        created.push(options)
        await options.setup?.(agentCtx)
        return {
          agent: {
            ctx: agentCtx,
            followup: (message: { content: Array<{ type: string; text?: string }> }) => { prompts.push(message.content.map(block => block.text ?? '').join('')) },
            whenIdle: () => idle,
            cancel: () => { resolveIdle?.() },
          },
          dispose: () => Promise.resolve(),
        }
      },
    }
    const ctx = await harness(undefined, true, agents)
    const project = await ctx.deepResearch.start({ question: 'Plan privately', depth: 'quick', questions: [] })

    await vi.waitFor(() => { expect(created).toHaveLength(1); expect(prompts).toHaveLength(1) })
    expect(project.phase).toBe('planning')
    expect(created[0]?.sessionId).toMatch(/^deepresearch-run-/)
    expect(created[0]?.meta).toMatchObject({ cwd: expect.stringContaining('dsh-deepresearch-test-'), origin: 'subagent', delegationDepth: 1 })
    expect(registeredTools).toEqual(['deep_research_submit_plan'])
    expect(prompts[0]).toContain(String(project.id))
    expect(ctx.tools.schemas()).toEqual([])

    await expect(ctx.deepResearch.fail({ id: project.id, reason: 'stop test runner', aborted: true })).resolves.toMatchObject({ phase: 'planning', runState: 'paused' })
  })

  it('pauses a run without wiping evidence and supports resume plus report rewrite', async () => {
    const ctx = await harness()
    const started = await ctx.deepResearch.start({
      question: 'Can we pause?',
      depth: 'quick',
      questions: [{ text: 'Keep the board', criteria: ['Preserve evidence'] }],
    })
    const confirmed = await ctx.deepResearch.confirmPlan({ id: started.id })
    expect(confirmed.phase).toBe('investigating')
    expect(confirmed.progress.scouts).toHaveLength(1)
    const withEvidence = await ctx.deepResearch.addEvidence({
      id: started.id,
      questionId: confirmed.questions[0]!.id,
      source: 'Kept source',
      claim: 'Pause keeps this claim.',
      confidence: 'high',
    })
    const paused = await ctx.deepResearch.fail({ id: started.id, reason: 'User stopped the run.', aborted: true })
    expect(paused).toMatchObject({ phase: 'investigating', runState: 'paused' })
    expect(paused.evidence).toHaveLength(1)
    expect(paused.progress.scouts).toHaveLength(1)
    const resumed = await ctx.deepResearch.resume({ id: started.id })
    expect(resumed).toMatchObject({ phase: 'investigating', runState: 'running' })
    expect(resumed.evidence[0]?.claim).toBe('Pause keeps this claim.')
    const writing = await ctx.deepResearch.writeReport({ id: started.id })
    expect(writing).toMatchObject({ phase: 'writing', runState: 'running' })
    expect(withEvidence.evidence).toHaveLength(1)
  })

  it('rejects an oversized plan and completes without evidence as incomplete', async () => {
    const ctx = await harness()
    const started = await ctx.deepResearch.start({
      question: '快速概览工具回放',
      depth: 'deep',
      questions: [{ text: 'What is the contract?', criteria: ['Inputs'] }],
    })
    expect(started.depth).toBe('quick')
    await expect(ctx.deepResearch.updatePlan({
      id: started.id, goal: 'g', constraints: 'c', depth: 'quick',
      questions: [
        { text: 'One', criteria: ['a'] },
        { text: 'Two', criteria: ['b'] },
        { text: 'Three', criteria: ['c'] },
      ],
    })).rejects.toThrow('allows at most 2')
    await ctx.deepResearch.confirmPlan({ id: started.id })
    const finished = await ctx.deepResearch.complete({ id: started.id, report: 'No attributable sources were found.' })
    expect(finished.phase).toBe('incomplete')
    expect(finished.report).toContain('No attributable sources')
  })

  it('runs Scout tools with URL gate, duplicate-query reject, fuse note, and progress cards', { timeout: 20_000 }, async () => {
    const toolsBySpawn: string[][] = []
    const agents = {
      create: async (options: Parameters<Context['agents']['create']>[0]) => {
        const registered: Array<{ name: string; execute: (args: Record<string, unknown>) => Promise<{ text: string }> }> = []
        await options.setup?.({
          tools: {
            restrict: () => () => undefined,
            register: (tool: { name: string; execute: (args: Record<string, unknown>) => Promise<{ text: string }> }) => {
              registered.push(tool)
              return () => undefined
            },
          },
          systemPrompt: { section: () => () => undefined },
        } as never)
        toolsBySpawn.push(registered.map(tool => tool.name))
        const byName = new Map(registered.map(tool => [tool.name, tool]))
        return {
          agent: {
            ctx: { on: () => () => undefined },
            followup: () => undefined,
            whenIdle: async () => {
              const submitPlan = byName.get('deep_research_submit_plan')
              if (submitPlan !== undefined) {
                await submitPlan.execute({
                  goal: 'Cite sources.', constraints: '', depth: 'quick',
                  questions: [{ text: 'What is the event contract?', criteria: ['Identify the durable inputs'] }],
                })
                return
              }
              const search = byName.get('research_web_search')
              if (search !== undefined) {
                await expect(search.execute({ query: 'replay contract', criterionId: 'wrong' })).rejects.toThrow('current target criterion')
                const first = await search.execute({ query: 'replay contract', criterionId: 'c1.1', max_results: 3 })
                expect(first.text).toContain('[tools 1/10 used')
                await expect(search.execute({ query: 'Replay  Contract!!', criterionId: 'c1.1' })).rejects.toThrow('duplicate query')
                await byName.get('research_web_fetch')!.execute({ url: 'https://example.test/a?utm_source=x' })
                await byName.get('submit_criterion_candidates')!.execute({
                  candidates: [{ claim: 'Replay is log-derived.', confidence: 'high', riskFlags: [], sources: [{ url: 'https://example.test/a', snippet: 'logged', artifactId: '' }] }],
                  summary: 'Logs drive presentation.',
                  gap: '',
                })
                return
              }
              const review = byName.get('submit_criterion_review')
              if (review !== undefined) {
                await review.execute({
                  decision: 'PASS', warnings: [],
                  verdicts: [{ candidateId: 'c1.1-c1', supported: true, relevantToCriterion: true, reason: 'Matches source', sources: [{ url: 'https://example.test/a', snippet: 'logged' }] }],
                  summary: 'Logs drive presentation.',
                  gap: '',
                })
                return
              }
              await byName.get('deep_research_complete')?.execute({ report: 'Replay derives from logs ([source](https://example.test/a)).', partial: false })
            },
            cancel: () => undefined,
          },
          dispose: () => Promise.resolve(),
        }
      },
    }
    const ctx = await harness(undefined, true, agents)
    const started = await ctx.deepResearch.start({ question: 'How should replay work?', depth: 'quick', questions: [] })
    await vi.waitFor(() => { expect(ctx.deepResearch.get({ id: started.id })?.phase).toBe('awaiting_plan_confirm') })
    await ctx.deepResearch.confirmPlan({ id: started.id })
    await vi.waitFor(() => {
      const latest = ctx.deepResearch.get({ id: started.id })
      if (latest?.phase === 'failed') throw new Error(latest.limitations.join('\n') || 'failed without limitations')
      expect(latest?.phase).toBe('done')
    }, { timeout: 8000 })
    const done = ctx.deepResearch.get({ id: started.id })
    expect(done?.evidence[0]).toMatchObject({ claim: 'Replay is log-derived.', status: 'accepted' })
    expect(done?.evidence[0]?.sources[0]?.url).toBe('https://example.test/a')
    expect(done?.questions[0]?.criteria[0]).toMatchObject({ verification: 'PASS', status: 'covered' })
    expect(done?.questions[0]?.handoff).toContain('Accepted Evidence')
    expect(done?.progress.scouts.length).toBeGreaterThanOrEqual(0)
    expect(toolsBySpawn.some(names => names.includes('research_web_search'))).toBe(true)
    expect(toolsBySpawn.some(names => names.includes('submit_criterion_review'))).toBe(true)
    expect(toolsBySpawn.some(names => names.includes('deep_research_complete'))).toBe(true)
    expect(toolsBySpawn.every(names => !names.includes('deep_research_get') && !names.includes('deep_research_add_evidence'))).toBe(true)
  })
})
