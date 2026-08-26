import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const harnessRoot = path.resolve(root, '../deepseek-harness')
const harnessModules = path.resolve(harnessRoot, 'node_modules')
const require = createRequire(path.join(harnessRoot, 'package.json'))
const { defineConfig } = await import(pathToFileURL(path.resolve(harnessModules, 'vitest/dist/config.js')).href)

function discoverHarnessPackages(repoRoot) {
  const map = new Map()
  const register = (pkgDir) => {
    try {
      const manifest = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'))
      if (typeof manifest.name === 'string') map.set(manifest.name, pkgDir)
    } catch {
      // skip
    }
  }
  for (const scope of ['packages', 'vendor']) {
    const scopePath = path.join(repoRoot, scope)
    let entries = []
    try {
      entries = readdirSync(scopePath)
    } catch {
      continue
    }
    for (const entry of entries) {
      const entryPath = path.join(scopePath, entry)
      if (!statSync(entryPath).isDirectory()) continue
      const nestedManifest = path.join(entryPath, 'package.json')
      if (statSync(nestedManifest, { throwIfNoEntry: false })?.isFile()) {
        register(entryPath)
        continue
      }
      for (const pkg of readdirSync(entryPath)) {
        const pkgDir = path.join(entryPath, pkg)
        if (statSync(pkgDir, { throwIfNoEntry: false })?.isDirectory()) register(pkgDir)
      }
    }
  }
  return map
}

const harnessPackages = discoverHarnessPackages(harnessRoot)

const resolvePkgDir = (id) => {
  if (id === 'zod') {
    return path.dirname(require.resolve('zod/package.json', {
      paths: [
        path.join(harnessRoot, 'packages/extensions/deepresearch/node_modules'),
        harnessModules,
        harnessRoot,
      ],
    }))
  }
  const discovered = harnessPackages.get(id)
  if (discovered !== undefined) return discovered
  return path.dirname(require.resolve(`${id}/package.json`, {
    paths: [harnessRoot, harnessModules, path.join(harnessRoot, 'node_modules')],
  }))
}

const resolvePkg = (id) => {
  const dir = resolvePkgDir(id)
  const manifest = JSON.parse(readFileSync(path.join(dir, 'package.json'), 'utf8'))
  const entry = manifest.exports?.['.']?.import
    ?? manifest.exports?.['.']?.default
    ?? manifest.module
    ?? manifest.main
    ?? 'lib/index.js'
  return path.join(dir, typeof entry === 'string' ? entry : entry.default ?? entry.import ?? manifest.main)
}

const harnessAliases = [
  '@deepseek-ai/cordis',
  '@deepseek-ai/dsh-system-prompt',
  '@deepseek-ai/dsh-tools',
  '@deepseek-ai/dsh-storage',
  '@deepseek-ai/dsh-storage-domain',
  '@deepseek-ai/dsh-storage-json',
  '@deepseek-ai/dsh-storage-json',
  '@deepseek-ai/dsh-storage-sqlite',
  '@deepseek-ai/dsh-web-fetch-http',
  '@deepseek-ai/dsh-typert-protocol',
  '@deepseek-ai/dsh-brand',
  '@deepseek-ai/dsh-agent',
  '@deepseek-ai/dsh-agent-default-model',
  '@deepseek-ai/dsh-agent-presets',
  '@deepseek-ai/dsh-llm',
  '@deepseek-ai/dsh-session',
  '@deepseek-ai/schemastery',
  'zod',
]

export default defineConfig({
  root,
  cacheDir: path.resolve(root, '.vite-host'),
  resolve: {
    alias: Object.fromEntries(harnessAliases.map(id => [id, resolvePkg(id)])),
  },
  test: {
    environment: 'node',
    include: ['tests/deepresearch.spec.ts', 'tests/investigation.spec.ts', 'tests/migrate.spec.ts'],
    server: {
      deps: {
        moduleDirectories: ['node_modules', harnessModules],
      },
    },
  },
})
