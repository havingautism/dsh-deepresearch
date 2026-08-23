import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const harnessRoot = path.resolve(root, '../deepseek-harness')
const pkgModules = path.resolve(harnessRoot, 'packages/extensions/deepresearch/node_modules')
const harnessModules = path.resolve(harnessRoot, 'node_modules')
const require = createRequire(path.join(harnessRoot, 'package.json'))
const vitestConfigUrl = pathToFileURL(path.resolve(harnessModules, 'vitest/dist/config.js')).href
const { defineConfig } = await import(vitestConfigUrl)

const resolvePkg = (id) => path.dirname(require.resolve(`${id}/package.json`, {
  paths: [pkgModules, path.resolve(harnessRoot, 'packages/client/ui-primitives'), harnessRoot],
}))

const deepseekAlias = Object.fromEntries(
  [
    'dsh-client-ui-primitives',
    'dsh-client-ui-slots',
    'dsh-client-locale',
    'dsh-client-runtime',
    'dsh-client-ui-layout',
    'dsh-client-ui-sidebar',
  ].map(name => [`@deepseek-ai/${name}`, path.resolve(pkgModules, `@deepseek-ai/${name}`)]),
)

const reactRoot = resolvePkg('react')
const reactDomRoot = resolvePkg('react-dom')

export default defineConfig({
  root,
  cacheDir: path.resolve(root, '.vite'),
  resolve: {
    alias: {
      ...deepseekAlias,
      react: reactRoot,
      'react-dom': reactDomRoot,
      'react/jsx-runtime': path.join(reactRoot, 'jsx-runtime.js'),
      'react/jsx-dev-runtime': path.join(reactRoot, 'jsx-dev-runtime.js'),
      '@testing-library/react': resolvePkg('@testing-library/react'),
      '@testing-library/dom': resolvePkg('@testing-library/dom'),
      zod: resolvePkg('zod'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/view.spec.tsx', 'tests/client.spec.ts', 'tests/project-hydrate.spec.ts'],
    css: true,
    server: {
      deps: {
        moduleDirectories: ['node_modules', pkgModules, harnessModules],
      },
    },
  },
})
