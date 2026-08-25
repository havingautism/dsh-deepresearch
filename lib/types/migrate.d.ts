/** On-disk deepresearch storage unit upgrades before the domain opens. */
import type { ResearchId, ResearchProject } from './types.ts';
export declare const DEEPRESEARCH_UNIT_NAME: string;
/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
export declare function defaultDeepResearchUnitPath(env?: NodeJS.ProcessEnv): string;
/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
export declare function resolveDeepResearchUnitPath(storageRoot?: string, env?: NodeJS.ProcessEnv): string;
/** Default SQLite file used when the domain is routed to the sqlite backend. */
export declare function defaultDeepResearchSqlitePath(env?: NodeJS.ProcessEnv): string;
/**
 * Upgrade a stored deepresearch JSON unit up to the current domain version.
 * @param path - Absolute unit file path.
 * @param targetVersion - Expected domain version after migration.
 * @returns true when the file was rewritten.
 */
export declare function migrateDeepResearchUnitFile(path: string, targetVersion?: number): Promise<boolean>;
/**
 * Copy leftover JSON projects into an empty domain table (JSON → SQLite cutover).
 * @param path - Migrated JSON unit path.
 * @param table - Opened projects table.
 * @returns number of imported projects.
 */
export declare function importJsonProjectsIfEmpty(path: string, table: {
    entries(): Iterable<[ResearchId, ResearchProject]>;
    put(id: ResearchId, project: ResearchProject): Promise<void>;
}): Promise<number>;
//# sourceMappingURL=migrate.d.ts.map