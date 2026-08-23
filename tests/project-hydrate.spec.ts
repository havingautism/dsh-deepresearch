import { describe, expect, it } from 'vitest'
import { hydrateResearchProject } from '../src/client/project-hydrate.ts'
import { ResearchId, ResearchQuestionId, type ResearchProject } from '../src/types.ts'

describe('hydrateResearchProject', () => {
  it('fills missing progress and scout tool rows', () => {
    const raw = {
      id: ResearchId('research-hydrate'),
      title: 'test',
      question: 'q',
      goal: '',
      constraints: '',
      seedText: '',
      depth: 'standard',
      phase: 'investigating',
      planConfirmed: true,
      questions: [{
        id: ResearchQuestionId('rq-1'),
        text: '子问题',
        status: 'running',
        criteria: [{ id: 'c1.1', text: '标准', status: 'missing' }],
      }],
      evidence: [],
      conclusions: [],
      limitations: [],
      report: null,
      budget: { maxSearches: 1, maxFetches: 1, searchesUsed: 0, fetchesUsed: 0 },
      createdAt: 1,
      updatedAt: 1,
    } as unknown as ResearchProject

    const hydrated = hydrateResearchProject(raw)
    expect(hydrated.progress.running).toBe(0)
    expect(hydrated.progress.scouts).toEqual([])
    expect(hydrated.questions[0]?.dependsOn).toEqual([])
    expect(hydrated.questions[0]?.gaps).toEqual([])
    expect(hydrated.questions[0]?.criteria[0]?.toolCount).toBe(0)
  })
})
