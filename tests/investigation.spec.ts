import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanupCriterionArtifacts, persistArtifact, readArtifact } from '../src/artifacts.ts'
import { assertPlanFitsDepth, inferResearchPlanDepth, isOversizedPlanError, planResearchBudget } from '../src/budget.ts'
import {
  appendToolBudgetNote, buildResearchWritingPack, collectLimitations, deriveLimitationRows,
  emptyProgress, emptyScoutProgress, gateCandidatesByUrl, mergeScoutProgress, normalizeQuery,
  normalizeSubmittedCandidates, normalizeUrl, parseCandidatesFromText, readableRoleDraft, selectReadyWaveBatch,
  uniqueSources,
} from '../src/investigation.ts'
import { ResearchId, ResearchQuestionId, type ResearchProject } from '../src/types.ts'

const artifactRoots: string[] = []
afterEach(async () => {
  await Promise.all(artifactRoots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

describe('depth and session budget', () => {
  it('forces brief cues to quick and sizes session caps from criteria with floors', () => {
    expect(inferResearchPlanDepth('快速看一眼这个问题', '')).toBe('quick')
    expect(inferResearchPlanDepth('深入系统梳理决策', '')).toBe('deep')
    expect(inferResearchPlanDepth('普通调研', '')).toBe('standard')
    expect(planResearchBudget(1)).toMatchObject({ maxSearches: 25, maxFetches: 200 })
    expect(planResearchBudget(4)).toMatchObject({ maxSearches: 40, maxFetches: 200 })
    expect(planResearchBudget(30)).toMatchObject({ maxSearches: 300, maxFetches: 300 })
  })

  it('rejects an oversized plan with a resubmittable RangeError', () => {
    const error = (() => {
      try {
        assertPlanFitsDepth('quick', [
          { criteria: ['a', 'b'] },
          { criteria: ['c'] },
          { criteria: ['d'] },
        ], { maxQuestions: 6, maxCriteriaPerQuestion: 3 })
      } catch (cause) {
        return cause
      }
    })()
    expect(isOversizedPlanError(error)).toBe(true)
    expect(String(error)).toContain('allows at most 2')
  })
})

describe('scout helpers', () => {
  it('normalizes queries and strips tracking params from URLs', () => {
    expect(normalizeQuery('Alpha!!  Search')).toBe('alpha search')
    expect(normalizeUrl('https://example.test/a/?utm_source=x&ref=1#hash')).toBe('https://example.test/a')
  })

  it('gates candidates to URLs seen in tool results and keeps multi-source claims', () => {
    const candidates = normalizeSubmittedCandidates([{
      claim: 'Replay is log-derived.',
      confidence: 'high',
      riskFlags: ['numeric'],
      sources: [
        { url: 'https://example.test/a?utm_campaign=x', snippet: 'logged args' },
        { url: 'https://example.test/missing', snippet: 'nope' },
      ],
    }, { claim: '', sources: [] }], 'c1.1')
    const urlIndex = new Map([['https://example.test/a', { url: 'https://example.test/a', text: 'logged args and results', artifactId: 'art_1' }]])
    const gated = gateCandidatesByUrl(candidates, urlIndex)
    expect(gated.accepted).toHaveLength(1)
    expect(gated.accepted[0]?.sources).toEqual([expect.objectContaining({ url: 'https://example.test/a', artifactId: 'art_1' })])
    expect(gated.rejected).toHaveLength(0)
    expect(gateCandidatesByUrl([{ ...candidates[0]!, sources: [{ url: 'https://other.test', snippet: '', artifactId: '', toolText: '' }] }], urlIndex).rejected[0]?.reason).toContain('not seen')
  })

  it('deduplicates sources per claim and keeps the strongest-first cap', () => {
    const candidates = normalizeSubmittedCandidates([{
      claim: 'Hooks replace most class patterns.',
      sources: [
        { url: 'https://example.test/a?utm_source=x', snippet: 'one' },
        { url: 'https://example.test/a', snippet: 'dup' },
        { url: 'https://example.test/b', snippet: 'two' },
        { url: 'https://example.test/c', snippet: 'three' },
        { url: 'https://example.test/d', snippet: 'dropped' },
      ],
    }], 'c1.1')
    expect(candidates[0]?.sources.map(source => source.url)).toEqual([
      'https://example.test/a',
      'https://example.test/b',
      'https://example.test/c',
    ])
    expect(uniqueSources([
      { url: 'https://example.test/a/' },
      { url: 'https://example.test/a' },
    ]).map(source => source.url)).toEqual(['https://example.test/a'])
  })

  it('parses scout JSON, annotates fuse use, and selects a ready wave of at most 3', () => {
    const parsed = parseCandidatesFromText('```json\n{"candidates":[{"claim":"A","sources":[{"url":"https://example.test/a","snippet":"s"}]}],"summary":"ok","gap":""}\n```', 'c1.1')
    expect(parsed.candidates).toHaveLength(1)
    expect(appendToolBudgetNote({ ok: true }, 3, 10)).toContain('[tools 3/10 used, 7 left]')
    const q = (id: string, deps: string[] = [], status: 'pending' | 'covered' = 'pending') => ({
      id: ResearchQuestionId(id), text: id, dependsOn: deps.map(ResearchQuestionId), status, criteria: [], gaps: [], handoff: '',
    })
    const wave = selectReadyWaveBatch([
      q('a'), q('b', ['a']), q('c'), q('d'), q('e'),
    ], 3)
    expect(wave.ready.map(item => item.id)).toEqual(['a', 'c', 'd'])
    expect(wave.waiting.map(item => item.question.id)).toEqual(['b', 'e'])
    const cycled = selectReadyWaveBatch([q('x', ['y']), q('y', ['x'])], 3)
    expect(cycled.ready).toHaveLength(1)
  })

  it('merges progress cards and builds a writing pack that cites pack URLs', () => {
    const questionId = ResearchQuestionId('rq-1')
    const progress = mergeScoutProgress(emptyProgress(), emptyScoutProgress(questionId, {
      role: 'scout', status: 'running', toolsUsed: 2, activity: 'Search: replay', tools: [{ name: 'research_web_search', detail: 'replay', status: 'done' }],
    }))
    expect(progress).toMatchObject({ running: 1, waiting: 0, scouts: [expect.objectContaining({ questionId, toolsUsed: 2, tools: [expect.objectContaining({ detail: 'replay' })] })] })
    const pack = buildResearchWritingPack({
      id: ResearchId('research-1'), title: 't', question: 'How should replay work?', goal: '', constraints: '', seedText: '', depth: 'standard',
      phase: 'writing', planConfirmed: true,
      questions: [{
        id: questionId, text: 'Event contract', dependsOn: [], status: 'partial', gaps: ['Need a second source'], handoff: '',
        criteria: [{ id: 'c1.1', text: 'Identify inputs', status: 'partial', summary: 'Logs drive UI', gap: 'Need a second source', warning: '', verification: 'WARNING', toolCount: 4 }],
      }],
      evidence: [{
        id: 'e1' as never, questionId, criterionIds: ['c1.1'], source: 'https://example.test/a', url: 'https://example.test/a',
        snippet: 'logged', sources: [{ url: 'https://example.test/a', snippet: 'logged' }], claim: 'Replay is log-derived.', confidence: 'high', status: 'accepted', createdAt: 1,
      }],
      conclusions: [], limitations: [], report: null, budget: planResearchBudget(1), progress, createdAt: 1, updatedAt: 1,
    } satisfies ResearchProject)
    expect(pack).toContain('url: https://example.test/a')
    expect(pack).toContain('Replay is log-derived.')
  })

  it('treats partial and rejected criteria as limitations even without a gap note', () => {
    const questionId = ResearchQuestionId('rq-1')
    const project = {
      questions: [{
        id: questionId, text: 'Event contract', dependsOn: [], status: 'partial' as const, gaps: [], handoff: '',
        criteria: [
          { id: 'c1.1', text: 'Identify inputs', status: 'covered' as const, summary: '', gap: '', warning: '', verification: 'PASS' as const, toolCount: 2 },
          { id: 'c1.2', text: 'Name a second source', status: 'partial' as const, summary: '', gap: 'Need a second source', warning: '', verification: 'WARNING' as const, toolCount: 4 },
          { id: 'c1.3', text: 'Reject stale docs', status: 'blocked' as const, summary: '', gap: '', warning: '', verification: 'FAIL' as const, toolCount: 3 },
        ],
      }],
      limitations: ['Runner note: budget exhausted'],
    }
    expect(deriveLimitationRows(project)).toEqual([
      expect.objectContaining({ criterionId: 'c1.2', status: 'partial', text: 'Need a second source' }),
      expect.objectContaining({ criterionId: 'c1.3', status: 'blocked', text: expect.stringMatching(/Rejected/) }),
      expect.objectContaining({ criterionId: '', text: 'Runner note: budget exhausted' }),
    ])
    expect(collectLimitations(project)).toEqual([
      'Event contract — c1.2 — Need a second source',
      'Event contract — c1.3 — Rejected — verification did not accept this criterion.',
      'Runner note: budget exhausted',
    ])
  })
})

describe('role drafts', () => {
  it('keeps model prose and drops tool-log payloads', () => {
    expect(readableRoleDraft('Search: replay contract')).toBe('')
    expect(readableRoleDraft('Fetch: https://example.test/a')).toBe('')
    expect(readableRoleDraft('{"ok":true}')).toBe('')
    expect(readableRoleDraft('Hooks reuse state without HOCs.')).toBe('Hooks reuse state without HOCs.')
  })
})

describe('artifacts', () => {
  it('persists, reads, and deletes a criterion artifact directory', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'dsh-research-art-'))
    artifactRoots.push(rootDir)
    const stored = await persistArtifact({ projectId: 'p1', questionId: 'q1', criterionId: 'c1', url: 'https://example.test/a', body: 'hello world', rootDir })
    expect(stored).not.toBeNull()
    const read = await readArtifact({ projectId: 'p1', questionId: 'q1', criterionId: 'c1', artifactId: stored!.artifactId, rootDir })
    expect(read.text).toBe('hello world')
    await cleanupCriterionArtifacts('p1', 'q1', 'c1', rootDir)
    await expect(readArtifact({ projectId: 'p1', questionId: 'q1', criterionId: 'c1', artifactId: stored!.artifactId, rootDir })).rejects.toThrow()
  })

  it('strips HTML chrome and keeps body text', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'dsh-research-art-'))
    artifactRoots.push(rootDir)
    const stored = await persistArtifact({
      projectId: 'p1', questionId: 'q1', criterionId: 'c1', url: 'https://example.test/hooks', rootDir,
      body: '<!DOCTYPE html><html><head><title>Hooks</title><script>window.__boot=1</script><style>nav{}</style></head><body><nav>Skip</nav><article><h1>Custom Hooks</h1><p>Reuse logic without HOCs.</p></article></body></html>',
    })
    expect(stored?.text).toContain('Custom Hooks')
    expect(stored?.text).toContain('Reuse logic without HOCs.')
    expect(stored?.text).not.toContain('window.__boot')
    expect(stored?.text).not.toContain('<head>')
  })

  it('caps persisted text at 200000 characters and windowed reads stay at 4000', async () => {
    const rootDir = await mkdtemp(join(tmpdir(), 'dsh-research-art-'))
    artifactRoots.push(rootDir)
    const stored = await persistArtifact({
      projectId: 'p1', questionId: 'q1', criterionId: 'c1', url: 'https://example.test/long', rootDir,
      body: 'x'.repeat(250000),
    })
    expect(stored?.text).toHaveLength(200000)
    const read = await readArtifact({ projectId: 'p1', questionId: 'q1', criterionId: 'c1', artifactId: stored!.artifactId, offset: 199000, maxChars: 8000, rootDir })
    expect(read.total).toBe(200000)
    expect(read.text).toHaveLength(1000)
  })
})
