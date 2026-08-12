/** Durable research board panel. */

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import type { ConvViewProps } from '@deepseek-ai/dsh-client-ui-conversation/client'
import type { InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { ResearchDepth, ResearchProject } from '../types.ts'
import type { ResearchViewApi } from './view-types.ts'
import css from './views.module.css'

/** Render project creation, phase summaries, evidence, and reports. */
export function ResearchView({ list, start }: ConvViewProps & InjectFace<ResearchViewApi>) {
  const [projects, setProjects] = useState<readonly ResearchProject[]>([])
  const [query, setQuery] = useState('')
  const [question, setQuestion] = useState('')
  const [depth, setDepth] = useState<ResearchDepth>('standard')
  const [plan, setPlan] = useState('界定问题\n检索权威来源\n交叉验证关键结论\n综合报告与不确定性')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (nextQuery: string) => {
    setError(null)
    try { setProjects(await list(nextQuery)) } catch (cause) { setError(messageOf(cause)) }
  }, [list])

  useEffect(() => { void refresh('') }, [refresh])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const steps = plan.split('\n').map(step => step.trim()).filter(step => step !== '')
    if (busy || question.trim() === '' || steps.length === 0) return
    setBusy(true)
    setError(null)
    void start({ question, depth, plan: steps }).then(
      () => {
        setQuestion('')
        setBusy(false)
        void refresh(query)
      },
      (cause: unknown) => {
        setError(messageOf(cause))
        setBusy(false)
      },
    )
  }

  return (
    <div className={css.shell} data-conversation-composer-overlay="">
      <header className={css.hero}>
        <div>
          <p className={css.eyebrow}>DEEP RESEARCH</p>
          <h2 className={css.heading}>深度研究</h2>
          <p className={css.subtitle}>先计划，再调查；证据、来源和报告持续留档。</p>
        </div>
        <div className={css.searchGroup}>
          <input className={css.input} value={query} onChange={(event) => { setQuery(event.target.value) }} placeholder="搜索研究问题或报告" />
          <button className={css.secondaryButton} type="button" onClick={() => { void refresh(query) }}>搜索</button>
        </div>
      </header>

      <div className={css.columns}>
        <form className={css.editor} onSubmit={submit}>
          <div className={css.sectionTitle}>发起研究</div>
          <textarea className={css.question} value={question} onChange={(event) => { setQuestion(event.target.value) }} placeholder="要深入研究什么？" />
          <select className={css.input} value={depth} onChange={(event) => { setDepth(event.target.value as ResearchDepth) }}>
            <option value="quick">快速</option>
            <option value="standard">标准</option>
            <option value="deep">深入</option>
          </select>
          <textarea className={css.plan} value={plan} onChange={(event) => { setPlan(event.target.value) }} aria-label="研究计划，每行一步" />
          <button className={css.primaryButton} type="submit" disabled={busy}>{busy ? '创建中…' : '创建研究计划'}</button>
          <p className={css.hint}>创建后，让模型按计划使用 Web / subagent 调研并写入证据。</p>
          {error === null ? null : <div className={css.error} role="alert">{error}</div>}
        </form>

        <section className={css.library} aria-label="研究项目">
          <div className={css.sectionTitle}>研究看板 <span className={css.count}>{projects.length}</span></div>
          {projects.length === 0 ? <div className={css.empty}>暂无研究项目。</div> : null}
          <div className={css.cardGrid}>
            {projects.map(project => (
              <article className={css.card} key={project.id}>
                <div className={css.cardHeader}>
                  <span className={css.phase} data-phase={project.phase}>{phaseLabel(project.phase)}</span>
                  <span className={css.meta}>{project.depth} · {project.evidence.length} 条证据</span>
                </div>
                <h3 className={css.cardTitle}>{project.question}</h3>
                <ol className={css.steps}>{project.plan.map(step => <li key={step}>{step}</li>)}</ol>
                {project.report === null ? null : (
                  <details className={css.report}><summary>查看最终报告</summary><p>{project.report}</p></details>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function phaseLabel(phase: ResearchProject['phase']): string {
  switch (phase) {
    case 'planning': return '计划中'
    case 'researching': return '调查中'
    case 'synthesizing': return '综合中'
    case 'complete': return '已完成'
  }
}

function messageOf(value: unknown): string {
  return value instanceof Error ? value.message : String(value)
}
