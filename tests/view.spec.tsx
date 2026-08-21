// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResearchView } from '../src/client/ResearchView.tsx'
import type { ResearchViewApi } from '../src/client/view-types.ts'
import { zh, type DeepResearchKey } from '../src/client/locales.ts'
import { ResearchId, ResearchQuestionId, type ResearchProject } from '../src/types.ts'

const t = (key: DeepResearchKey, params?: Record<string, unknown>) => Object.entries(params ?? {}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), zh[key])
const inputActions = { setDraft: vi.fn(), submit: vi.fn() }

afterEach(cleanup)

function props(api: ResearchViewApi): Parameters<typeof ResearchView>[0] {
  return { ...api, t, inputActions } as unknown as Parameters<typeof ResearchView>[0]
}

describe('Deep Research view', () => {
  it('submits an editable starter plan through the mounted API', async () => {
    const start = vi.fn<ResearchViewApi['start']>(() => new Promise<never>(() => undefined))
    const api = {
      list: vi.fn(async () => []),
      start,
    } as unknown as ResearchViewApi

    render(<ResearchView {...props(api)} />)
    fireEvent.click((await screen.findAllByRole('button', { name: /发起研究/ }))[0]!)
    fireEvent.change(screen.getByPlaceholderText('你想深入研究什么？'), { target: { value: '验证插件是否可运行' } })
    fireEvent.click(screen.getByRole('button', { name: '创建研究计划' }))

    await waitFor(() => { expect(start).toHaveBeenCalledOnce() })
    expect(start.mock.calls[0]?.[0]).toMatchObject({
      question: '验证插件是否可运行',
      questions: expect.arrayContaining([
        expect.objectContaining({ text: expect.stringContaining('验证插件是否可运行') }),
      ]),
    })
  })

  it('saves, confirms, and submits the investigation into the current DSH session', async () => {
    inputActions.setDraft.mockClear(); inputActions.submit.mockClear()
    const draft: ResearchProject = {
      id: ResearchId('research-ui-flow'), title: '🔬 验证深度研究', question: 'DSH 插件如何完成深度研究？', goal: '给出有来源的结论', constraints: '优先官方来源', seedText: '', depth: 'standard', phase: 'awaiting_plan_confirm', planConfirmed: false,
      questions: [{ id: ResearchQuestionId('rq-1'), text: '核对运行链路', dependsOn: [], status: 'pending', criteria: [{ id: 'c1.1', text: '至少两个来源', status: 'missing', summary: '', gap: '' }] }],
      evidence: [], conclusions: [], limitations: [], report: null, budget: { maxSearches: 18, maxFetches: 14, searchesUsed: 0, fetchesUsed: 0 }, createdAt: 1, updatedAt: 1,
    }
    const saved = { ...draft, updatedAt: 2 }
    const confirmed = { ...saved, phase: 'investigating' as const, planConfirmed: true, updatedAt: 3 }
    const api = {
      list: vi.fn(async () => [draft]), get: vi.fn(async () => confirmed),
      updatePlan: vi.fn(async () => saved), confirmPlan: vi.fn(async () => confirmed),
      start: vi.fn(), complete: vi.fn(), fail: vi.fn(), delete: vi.fn(),
    } as unknown as ResearchViewApi

    render(<ResearchView {...props(api)} />)
    fireEvent.click(await screen.findByRole('button', { name: '打开研究：🔬 验证深度研究' }))
    fireEvent.click(screen.getByRole('button', { name: '确认并开始' }))

    await waitFor(() => { expect(inputActions.submit).toHaveBeenCalledOnce() })
    expect(api.updatePlan).toHaveBeenCalledOnce()
    expect(api.confirmPlan).toHaveBeenCalledWith(ResearchId('research-ui-flow'))
    expect(inputActions.setDraft).toHaveBeenCalledWith(expect.stringContaining('deep_research_add_evidence'))
    expect(inputActions.setDraft).toHaveBeenCalledWith(expect.stringContaining('Project ID: research-ui-flow'))
    expect(await screen.findByText('调查看板')).toBeTruthy()
  })
})
