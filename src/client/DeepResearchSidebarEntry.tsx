/** Sidebar foot control that opens the global Deep Research workspace. */

import { useSyncExternalStore } from 'react'
import { IconSparkle16 as IconBolt } from '@deepseek-ai/dsh-client-ui-primitives'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { DeepResearchKey } from './locales.ts'
import type { DeepResearchClientFace } from './client-face.ts'
import css from './sidebar-entry.module.css'

type DeepResearchSidebarEntryProps =
  PropsRuntime<'sidebar.footer.action'>
  & InjectFace<DeepResearchClientFace>
  & PropsLocale<'deepresearch'>

/** Render the sidebar launch button for the frame-wide research overlay. */
export function DeepResearchSidebarEntry({ wide, t, ...face }: DeepResearchSidebarEntryProps) {
  const open = useSyncExternalStore(face.store.subscribe, face.store.getOpen)
  return (
    <div className={wide ? css.layer : `${css.layer} ${css.rail}`}>
      <button
        type="button"
        className={css.badge}
        data-active={open || undefined}
        aria-pressed={open}
        aria-label={t('view.deepResearch' as DeepResearchKey)}
        onClick={() => { face.store.setOpen(!open) }}
      >
        <IconBolt size={16} />
        {wide ? <span className={css.badgeLabel}>{t('view.deepResearch' as DeepResearchKey)}</span> : null}
      </button>
    </div>
  )
}
