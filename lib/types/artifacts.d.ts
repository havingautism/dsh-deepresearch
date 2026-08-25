/** On-disk fetch bodies for Scout / Evaluator. Not stored in the project JSON. */
/** Default root under the user's DSH home. */
export declare function researchArtifactsRoot(rootDir?: string): string;
/** Directory for one criterion's artifacts. */
export declare function artifactDirFor(projectId: string, questionId: string, criterionId: string, rootDir?: string): string;
/** Directory for one project. */
export declare function projectArtifactsDir(projectId: string, rootDir?: string): string;
export interface PersistedArtifact {
    readonly artifactId: string;
    readonly url: string;
    readonly preview: string;
    readonly text: string;
}
/** Codemini-aligned readable text: strip script/style/noscript, keep body text. */
export declare function readableFetchText(body: string): string;
/** Persist a fetched page body and return the artifact id. */
export declare function persistArtifact(scope: {
    projectId: string;
    questionId: string;
    criterionId: string;
    url: string;
    body: string;
    rootDir?: string;
}): Promise<PersistedArtifact | null>;
/** Read a slice of a persisted artifact. Throws when the id is unknown. */
export declare function readArtifact(scope: {
    projectId: string;
    questionId: string;
    criterionId: string;
    artifactId: string;
    offset?: number;
    maxChars?: number;
    rootDir?: string;
}): Promise<{
    artifactId: string;
    text: string;
    offset: number;
    total: number;
}>;
/** Best-effort remove one criterion's artifacts. */
export declare function cleanupCriterionArtifacts(projectId: string, questionId: string, criterionId: string, rootDir?: string): Promise<void>;
/** Best-effort remove every artifact for a project. */
export declare function cleanupProjectArtifacts(projectId: string, rootDir?: string): Promise<void>;
//# sourceMappingURL=artifacts.d.ts.map