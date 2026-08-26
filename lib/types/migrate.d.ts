/** On-disk deepresearch storage unit upgrades before the domain opens. */
import type { ResearchId, ResearchProject } from './types.ts';
export declare const DEEPRESEARCH_UNIT_NAME: string;
export declare const SHARED_SQLITE_FILENAME = "dsh.sqlite";
/** Default JSON unit path used by the web profile (`dshHomePath('storages')`). */
export declare function defaultDeepResearchUnitPath(env?: NodeJS.ProcessEnv): string;
/** Resolve the on-disk unit file, optionally overriding the storages directory (tests). */
export declare function resolveDeepResearchUnitPath(storageRoot?: string, env?: NodeJS.ProcessEnv): string;
/** Canonical sqlite file both product plugins mount when the host has none. */
export declare function defaultSharedSqlitePath(env?: NodeJS.ProcessEnv): string;
/** Leftover plugin-named sqlite from before the shared-file cutover. */
export declare function defaultDeepResearchSqlitePath(env?: NodeJS.ProcessEnv): string;
export declare function legacyDeepResearchSqlitePath(sqlitePath: string): string;
/** Read JSON records from one sqlite KV table, or [] when the file/table is missing. */
export declare function loadSqliteTableValues(path: string, unit: string, table: string): unknown[];
/**
 * Copy leftover `deepresearch.sqlite` projects into an empty domain table.
 * Skips when the live table already has rows, the legacy file is the live file, or the file is missing.
 */
export declare function importLegacySqliteProjectsIfEmpty(legacyPath: string, liveSqlitePath: string, table: {
    entries(): Iterable<[ResearchId, ResearchProject]>;
    put(id: ResearchId, project: ResearchProject): Promise<void>;
}): Promise<number>;
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