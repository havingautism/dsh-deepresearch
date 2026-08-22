// @vitest-environment jsdom

import React from 'react'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResearchView } from '../src/client/ResearchView.tsx'
import type { ResearchViewApi } from '../src/client/view-types.ts'
import { zh, type DeepResearchKey } from '../src/client/locales.ts'
import { ResearchId, ResearchQuestionId, type ResearchProject } from '../src/types.ts'

const t = (key: DeepResearchKey, params?: Record<string, unknown>) => Object.entries(params ?? {}).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), zh[key])

function props(api: ResearchViewApi): Parameters<typeof ResearchView>[0] {
  return { ...api, t }
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
      questions: [],
    })
  })

  it('saves and starts the private research runner', async () => {
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

    await waitFor(() => { expect(api.confirmPlan).toHaveBeenCalledOnce() })
    expect(api.updatePlan).toHaveBeenCalledOnce()
    expect(api.confirmPlan).toHaveBeenCalledWith(ResearchId('research-ui-flow'))
    expect(await screen.findByText('调查看板')).toBeTruthy()
  })

  it('keeps plan and investigate tabs reachable on completed projects', async () => {
    const done: ResearchProject = {
      id: ResearchId('research-done'), title: '🔬 已完成研究', question: '已完成？', goal: '目标', constraints: '', seedText: '', depth: 'standard', phase: 'done', planConfirmed: true,
      questions: [{ id: ResearchQuestionId('rq-1'), text: '子问题', dependsOn: [], status: 'covered', criteria: [{ id: 'c1.1', text: '标准', status: 'covered', summary: '', gap: '' }] }],
      evidence: [{ id: 'e1', source: '来源', claim: '结论', snippet: '片段', url: null, confidence: 'high' }], conclusions: [], limitations: [], report: '# 综合报告\n\n这是摘要。',
      budget: { maxSearches: 18, maxFetches: 14, searchesUsed: 1, fetchesUsed: 1 }, createdAt: 1, updatedAt: 2,
    }
    const api = { list: vi.fn(async () => [done]), get: vi.fn(async () => done), delete: vi.fn() } as unknown as ResearchViewApi

    render(<ResearchView {...props(api)} />)
    fireEvent.click(await screen.findByRole('button', { name: '打开研究：🔬 已完成研究' }))
    expect(screen.getByRole('button', { name: '3 报告' }).getAttribute('data-active')).toBe('true')
    expect(screen.getByRole('heading', { name: '综合报告' })).toBeTruthy()
    expect(screen.queryByText('# 综合报告')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '1 计划' }))
    expect(screen.getByRole('button', { name: '1 计划' }).getAttribute('data-active')).toBe('true')
    expect(screen.getByText('研究计划')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '2 调查' }))
    expect(screen.getByRole('button', { name: '2 调查' }).getAttribute('data-active')).toBe('true')
    expect(screen.getByText('调查看板')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: '深度研究' }))
    expect(screen.getByRole('heading', { name: '研究资料库' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: '返回对话' })).toBeNull()
  })

  it('restores a project from the overlay route and returns to the library one layer at a time', async () => {
    const done: ResearchProject = {
      id: ResearchId('research-route'), title: '🔬 路由恢复', question: '刷新后还在吗？', goal: '', constraints: '', seedText: '', depth: 'standard', phase: 'done', planConfirmed: true,
      questions: [{ id: ResearchQuestionId('rq-1'), text: '子问题', dependsOn: [], status: 'covered', criteria: [{ id: 'c1.1', text: '标准', status: 'covered', summary: '', gap: '' }] }],
      evidence: [], conclusions: [], limitations: [], report: '报告正文',
      budget: { maxSearches: 18, maxFetches: 14, searchesUsed: 1, fetchesUsed: 1 }, createdAt: 1, updatedAt: 2,
    }
    const onSelectProject = vi.fn()
    const onClose = vi.fn()
    const api = { list: vi.fn(async () => [done]), get: vi.fn(async () => done), delete: vi.fn() } as unknown as ResearchViewApi

    render(<ResearchView {...props(api)} projectId={done.id} onSelectProject={onSelectProject} onClose={onClose} />)
    expect(await screen.findByRole('button', { name: '深度研究' })).toBeTruthy()
    expect(screen.queryByText('返回对话')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '深度研究' }))
    expect(onSelectProject).toHaveBeenCalledWith(null)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('keeps a failed planning run on the plan step and shows its runner error', async () => {
    const failed: ResearchProject = {
      id: ResearchId('research-plan-failed'), title: '🔬 失败计划', question: '为什么失败？', goal: '', constraints: '', seedText: '', depth: 'standard', phase: 'failed', planConfirmed: false,
      questions: [], evidence: [], conclusions: [], limitations: ['Runner failed: prompt variable "{{cwd}}" has no value'], report: null,
      budget: { maxSearches: 18, maxFetches: 14, searchesUsed: 0, fetchesUsed: 0 }, createdAt: 1, updatedAt: 2,
    }
    const api = { list: vi.fn(async () => [failed]), get: vi.fn(async () => failed), delete: vi.fn() } as unknown as ResearchViewApi

    render(<ResearchView {...props(api)} />)
    fireEvent.click(await screen.findByRole('button', { name: '打开研究：🔬 失败计划' }))

    expect(screen.getByRole('button', { name: '1 计划' }).getAttribute('data-active')).toBe('true')
    expect(screen.getByRole('button', { name: '2 调查' }).hasAttribute('disabled')).toBe(true)
    expect(screen.getByText('研究计划生成失败')).toBeTruthy()
    expect(screen.getByText(/prompt variable/)).toBeTruthy()
  })
})
