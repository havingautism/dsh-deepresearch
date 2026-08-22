import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import Tools from '@deepseek-ai/dsh-tools'
import Storage from '@deepseek-ai/dsh-storage'
import * as StorageDomain from '@deepseek-ai/dsh-storage-domain'
import * as StorageJson from '@deepseek-ai/dsh-storage-json'
import { remoteMethods } from '@deepseek-ai/dsh-typert-protocol'
import DeepResearch, { ResearchId } from '../src/index.ts'

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
  await ctx.plugin(StorageJson, { root: storageRoot })
  await ctx.plugin(StorageDomain, { backend: 'json' })
  ctx.provide('agents', agents as never)
  ctx.provide('agentDefaultModel', { currentSelection: () => ({ provider: 'test', model: 'test' }) } as never)
  await ctx.plugin(DeepResearch, {
    runnerEnabled,
    runnerCwd: storageRoot,
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
      'updateQuestion', 'complete', 'fail', 'delete',
    ])
    expect(ctx.tools.schemas().map(schema => schema.name)).toEqual([])
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
    expect(revised.budget.maxSearches).toBeGreaterThan(research.budget.maxSearches)
    await first.deepResearch.fail({ id: research.id, reason: 'User stopped the run.', aborted: true })
    await first.fiber.dispose()
    contexts.splice(contexts.indexOf(first), 1)

    const second = await harness(root)
    expect(second.deepResearch.get({ id: research.id })).toMatchObject({ phase: 'aborted', goal: 'Verify durable restoration.' })
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
    expect(registeredTools).toEqual([
      'deep_research_get', 'deep_research_submit_plan', 'deep_research_add_evidence',
      'deep_research_update_coverage', 'deep_research_complete',
    ])
    expect(prompts[0]).toContain(String(project.id))
    expect(ctx.tools.schemas()).toEqual([])

    await expect(ctx.deepResearch.fail({ id: project.id, reason: 'stop test runner', aborted: true })).resolves.toMatchObject({ phase: 'aborted' })
  })
})
