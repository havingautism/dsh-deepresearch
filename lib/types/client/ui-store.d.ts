/** Root-scoped overlay route: open/close plus the selected project, synced to the URL hash. */
export interface DeepResearchUiStore {
    getOpen(): boolean;
    setOpen(open: boolean): void;
    getProjectId(): string | null;
    setProjectId(id: string | null): void;
    subscribe(listener: () => void): () => void;
}
interface DeepResearchRoute {
    open: boolean;
    projectId: string | null;
}
/** Parse `#deepresearch` and `#deepresearch/<id>` from the current location. */
export declare function readDeepResearchRoute(hash?: string): DeepResearchRoute;
/** Create one overlay store shared by the sidebar entry and shell overlay. */
export declare function createDeepResearchUiStore(): DeepResearchUiStore;
export {};
//# sourceMappingURL=ui-store.d.ts.map