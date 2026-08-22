/** Root-scoped open/close state for the sidebar-launched research overlay. */
export interface DeepResearchUiStore {
    getOpen(): boolean;
    setOpen(open: boolean): void;
    subscribe(listener: () => void): () => void;
}
/** Create one overlay store shared by the sidebar entry and shell overlay. */
export declare function createDeepResearchUiStore(): DeepResearchUiStore;
//# sourceMappingURL=ui-store.d.ts.map