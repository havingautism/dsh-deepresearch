# dsh-deepresearch · Deep Research

English | [中文](README.md)

> An evidence-first DeepSeek Harness research workflow. It composes the profile's existing Web and subagent capabilities while making plans, sources, phases, and reports durable and reviewable.

**Status** Preview · **Version** 0.1.0 · **Branch** `main`

## Features

- **Evidence first**: create a project, gather sourced findings, then synthesize.
- **Cross-session recovery**: plans, evidence, phase, and report use the Harness storage domain.
- **Composed execution**: search and parallel investigation remain owned by active Web/subagent plugins.
- **Native model tools**: start, add evidence, complete, and list.
- **Self-contained Web Remote**: the plugin mounts `remote.deepResearch` for UI clients.
- **State enforcement**: completed projects reject additional evidence.

## Quick start

```sh
dsh plugin --profile web add github:dsh-external/dsh-deepresearch
dsh web
```

Ask for a sourced deep research task with an explicit plan, evidence comparison, and uncertainty. A healthy run uses `deep_research_start`, the configured Web/subagent tools, `deep_research_add_evidence`, and `deep_research_complete`. Another session can recover it with `deep_research_list`.

Install [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui) for a dedicated Web research tab.

## Tools

| Tool | Purpose |
| --- | --- |
| `deep_research_start` | Save the question, depth (quick/standard/deep), and plan |
| `deep_research_add_evidence` | Append a source name, optional URL, and evidence summary |
| `deep_research_complete` | Save the synthesized report and mark the project complete |
| `deep_research_list` | List projects, optionally filtering by text or phase |

The plugin also contributes short guidance requiring explicit research requests to create a project first, retain only sourced findings, compare evidence, and state uncertainty before completion.

## Data and configuration

The patch permits 1,000 projects, 200 evidence records per project, and 200,000 report characters. Records use the profile's `storage-domain` backend. The plugin does not add a second search engine or scheduler.

## Verification and development

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/extensions.spec.ts
pnpm --filter @deepseek-ai/dsh-deepresearch bundle -- --env.DSH_BUILD_FACE=client
```

Installable `lib/` artifacts are committed; run `npm run verify` for a syntax check.

## Known limitations

- The plugin records orchestration state but does not execute searches or launch subagents itself.
- Evidence is append-only, and completed projects cannot accept more evidence.
- Source fields and workflow guidance do not automatically validate URL contents or source quality.
- This is the standalone distribution of the corresponding extension developed in the private Harness source tree.
