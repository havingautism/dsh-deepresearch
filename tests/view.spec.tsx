// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ResearchView } from '../src/client/ResearchView.tsx'
import type { ResearchViewApi } from '../src/client/view-types.ts'

describe('Deep Research view', () => {
  it('submits an editable starter plan through the mounted API', async () => {
    const start = vi.fn<ResearchViewApi['start']>(() => new Promise<never>(() => undefined))
    const api = {
      list: vi.fn(async () => []),
      start,
    } as unknown as ResearchViewApi

    render(<ResearchView {...api as Parameters<typeof ResearchView>[0]} />)
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
})
