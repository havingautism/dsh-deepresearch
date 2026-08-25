/** Frame-wide overlay hosting the Deep Research library and workspace. */

import { Component, useSyncExternalStore, type ReactNode } from 'react'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { ResearchView } from './ResearchView.tsx'
import type { DeepResearchKey } from './locales.ts'
import type { DeepResearchClientFace } from './client-face.ts'
import css from './overlay.module.css'

type DeepResearchOverlayProps = InjectFace<DeepResearchClientFace> & PropsLocale<'deepresearch'>

type OverlayCrashProps = { t: DeepResearchOverlayProps['t']; onReset: () => void; children: ReactNode }

/** Keep render failures inside the overlay instead of abdicating the shell slot. */
class ResearchViewCrashBoundary extends Component<OverlayCrashProps, { error: Error | null }> {
  override state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) { return { error } }

  override render() {
    if (this.state.error === null) return this.props.children
    return <div className={css.crash} role="alert">
      <h3>{this.props.t('overlay.crashTitle' as DeepResearchKey)}</h3>
      <p>{this.props.t('overlay.crashHint' as DeepResearchKey)}</p>
      <code>{this.state.error.message}</code>
      <button type="button" onClick={() => { this.setState({ error: null }); this.props.onReset() }}>{this.props.t('overlay.crashBack' as DeepResearchKey)}</button>
    </div>
  }
}

/** Render the research workspace when the sidebar entry opens the overlay. */
export function DeepResearchOverlay({ t, ...face }: DeepResearchOverlayProps) {
  const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen)
  const projectId = useSyncExternalStore(face.store.subscribe, face.store.getProjectId)
  if (!open) return null
  return (
    <div className={css.overlay} data-deepresearch-overlay role="dialog" aria-modal="true" aria-label={t('view.deepResearch' as DeepResearchKey)}>
      <ResearchViewCrashBoundary t={t} onReset={() => { face.store.setProjectId(null) }}>
        <ResearchView
          t={t}
          {...face.api}
          projectId={projectId}
          onSelectProject={id => { face.store.setProjectId(id) }}
          onClose={() => { face.store.setOpen(false) }}
        />
      </ResearchViewCrashBoundary>
    </div>
  )
}
