/** Frame-wide overlay hosting the Deep Research library and workspace. */

import { useSyncExternalStore } from 'react'
import type { InjectFace, PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import { ResearchView } from './ResearchView.tsx'
import type { DeepResearchKey } from './locales.ts'
import type { DeepResearchClientFace } from './client-face.ts'
import css from './overlay.module.css'

type DeepResearchOverlayProps = InjectFace<DeepResearchClientFace> & PropsLocale<'deepresearch'>

/** Render the research workspace when the sidebar entry opens the overlay. */
export function DeepResearchOverlay({ t, ...face }: DeepResearchOverlayProps) {
  const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen)
  const projectId = useSyncExternalStore(face.store.subscribe, face.store.getProjectId)
  if (!open) return null
  return (
    <div className={css.overlay} data-deepresearch-overlay role="dialog" aria-modal="true" aria-label={t('view.deepResearch' as DeepResearchKey)}>
      <ResearchView
        t={t}
        {...face.api}
        projectId={projectId}
        onSelectProject={id => { face.store.setProjectId(id) }}
        onClose={() => { face.store.setOpen(false) }}
      />
    </div>
  )
}
