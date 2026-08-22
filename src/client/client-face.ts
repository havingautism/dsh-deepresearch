import type { ResearchViewApi } from './view-types.ts'
import type { DeepResearchUiStore } from './ui-store.ts'

/** Shared client face for the sidebar entry and shell overlay. */
export interface DeepResearchClientFace {
  readonly api: ResearchViewApi
  readonly store: DeepResearchUiStore
}
