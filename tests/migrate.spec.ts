import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DatabaseSync } from 'node:sqlite'
import { afterEach, describe, expect, it } from 'vitest'
import { defaultDeepResearchSqlitePath, defaultDeepResearchUnitPath, defaultSharedSqlitePath, importJsonProjectsIfEmpty, importLegacySqliteProjectsIfEmpty, migrateDeepResearchUnitFile } from '../src/migrate.ts'

const roots: string[] = []
afterEach(async () => {
  await Promise.all(roots.splice(0).map(root => rm(root, { recursive: true, force: true })))
})

describe('deepresearch storage migration', () => {
  it('defaults the unit path under DSH_HOME/storages', () => {
    expect(defaultDeepResearchUnitPath({ DSH_HOME: '/tmp/custom-dsh' })).toBe('/tmp/custom-dsh/storages/deepresearch.json')
    expect(defaultDeepResearchSqlitePath({ DSH_HOME: '/tmp/custom-dsh' })).toBe('/tmp/custom-dsh/storages/deepresearch.sqlite')
    expect(defaultSharedSqlitePath({ DSH_HOME: '/tmp/custom-dsh' })).toBe('/tmp/custom-dsh/storages/dsh.sqlite')
  })

  it('upgrades v2 projects to v3 with runState and normalized aborted phase', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-migrate-'))
    roots.push(root)
    const path = join(root, 'deepresearch.json')
    await writeFile(path, `${JSON.stringify({
      unit: { name: 'deepresearch', version: 2 },
      global: null,
      tables: {
        projects: {
          'research-a': {
            id: 'research-a',
            title: 'A',
            question: 'Q',
            goal: '',
            constraints: '',
            seedText: '',
            depth: 'quick',
            phase: 'aborted',
            planConfirmed: true,
            questions: [],
            evidence: [],
            conclusions: [],
            limitations: [],
            report: null,
            budget: { maxSearches: 25, maxFetches: 200, searchesUsed: 3, fetchesUsed: 1 },
            createdAt: 1,
            updatedAt: 2,
          },
          'research-b': {
            id: 'research-b',
            title: 'B',
            question: 'Q2',
            goal: '',
            constraints: '',
            seedText: '',
            depth: 'quick',
            phase: 'done',
            planConfirmed: true,
            questions: [],
            evidence: [],
            conclusions: [],
            limitations: [],
            report: 'done',
            budget: { maxSearches: 25, maxFetches: 200, searchesUsed: 0, fetchesUsed: 0 },
            createdAt: 1,
            updatedAt: 2,
          },
        },
      },
    }, null, 2)}\n`, 'utf8')

    await expect(migrateDeepResearchUnitFile(path, 3)).resolves.toBe(true)
    const migrated = JSON.parse(await readFile(path, 'utf8')) as {
      unit: { version: number }
      tables: { projects: Record<string, { phase: string; runState: string; progress: unknown }> }
    }
    expect(migrated.unit.version).toBe(3)
    expect(migrated.tables.projects['research-a']).toMatchObject({
      phase: 'investigating',
      runState: 'paused',
      progress: { running: 0, waiting: 0, scouts: [] },
    })
    expect(migrated.tables.projects['research-b']).toMatchObject({ phase: 'done', runState: 'idle' })
    await expect(migrateDeepResearchUnitFile(path, 3)).resolves.toBe(false)
  })

  it('imports leftover JSON projects into an empty table once', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-import-'))
    roots.push(root)
    const path = join(root, 'deepresearch.json')
    await writeFile(path, `${JSON.stringify({
      unit: { name: 'deepresearch', version: 3 },
      global: null,
      tables: {
        projects: {
          'research-a': {
            id: 'research-a', title: 'A', question: 'Q', goal: '', constraints: '', seedText: '',
            depth: 'quick', phase: 'done', runState: 'idle', planConfirmed: true,
            questions: [], evidence: [], conclusions: [], limitations: [], report: 'ok',
            budget: { maxSearches: 25, maxFetches: 200, searchesUsed: 0, fetchesUsed: 0 },
            progress: { running: 0, waiting: 0, scouts: [] },
            createdAt: 1, updatedAt: 2,
          },
        },
      },
    }, null, 2)}\n`, 'utf8')
    const records = new Map()
    const table = {
      entries: () => records.entries(),
      put: async (id, project) => { records.set(id, project) },
    }
    await expect(importJsonProjectsIfEmpty(path, table)).resolves.toBe(1)
    expect(records.get('research-a')).toMatchObject({ title: 'A', runState: 'idle' })
    await expect(importJsonProjectsIfEmpty(path, table)).resolves.toBe(0)
  })

  it('imports leftover sqlite projects once and ignores stale JSON afterwards', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-sqlite-import-'))
    roots.push(root)
    const legacy = join(root, 'deepresearch.sqlite')
    const live = join(root, 'dsh.sqlite')
    const project = {
      id: 'research-a', title: 'From sqlite', question: 'Q', goal: '', constraints: '', seedText: '',
      depth: 'quick', phase: 'done', runState: 'idle', planConfirmed: true,
      questions: [], evidence: [], conclusions: [], limitations: [], report: 'ok',
      budget: { maxSearches: 25, maxFetches: 200, searchesUsed: 0, fetchesUsed: 0 },
      progress: { running: 0, waiting: 0, scouts: [] },
      createdAt: 1, updatedAt: 2,
    }
    const db = new DatabaseSync(legacy)
    db.exec('CREATE TABLE u_deepresearch_projects (key TEXT PRIMARY KEY, value TEXT) STRICT')
    db.prepare('INSERT INTO u_deepresearch_projects (key, value) VALUES (?, ?)').run(project.id, JSON.stringify(project))
    db.close()
    const records = new Map()
    const table = {
      entries: () => records.entries(),
      put: async (id, next) => { records.set(id, next) },
    }
    await expect(importLegacySqliteProjectsIfEmpty(legacy, live, table)).resolves.toBe(1)
    expect(records.get('research-a')).toMatchObject({ title: 'From sqlite' })
    await expect(importLegacySqliteProjectsIfEmpty(legacy, live, table)).resolves.toBe(0)
    await expect(importJsonProjectsIfEmpty(join(root, 'deepresearch.json'), table)).resolves.toBe(0)
  })

  it('no-ops when the unit file is missing', async () => {
    const root = await mkdtemp(join(tmpdir(), 'dsh-deepresearch-migrate-'))
    roots.push(root)
    await expect(migrateDeepResearchUnitFile(join(root, 'missing.json'), 3)).resolves.toBe(false)
  })
})
