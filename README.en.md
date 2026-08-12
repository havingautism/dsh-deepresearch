# 🔬 dsh-deepresearch · Deep Research

English | [中文](README.md)

> An independent evidence-first research plugin for DeepSeek Harness. This repository owns the research tools, durable workflow, typed Remote API, and Deep Research Web conversation view.

**Status** Preview · **Version** 0.1.0 · **Branch** `main`

## ✨ Features

- 🧭 Turn a question into an explicit, resumable research plan.
- 🔎 Preserve sources, evidence summaries, phases, and the final report.
- 🤖 Use four native model tools for start, add evidence, complete, and list.
- 💬 Inspect projects and start plans from the built-in Deep Research conversation view.
- 🧰 Compose the profile's existing Web and subagent capabilities instead of adding another runner.

## 🚀 Quick Start

Install this plugin by itself for the complete research workflow:

```sh
dsh plugin --profile web add github:dsh-external/dsh-deepresearch
dsh web
```

The Web app gains a Deep Research conversation view. Ask for a sourced research task with an explicit plan, evidence comparison, and uncertainty. A healthy run uses `deep_research_start`, configured Web/subagent tools, `deep_research_add_evidence`, and `deep_research_complete`; another session can recover it with `deep_research_list`.

## 🛠️ Tools and API

| Tool | Purpose |
| --- | --- |
| `deep_research_start` | Save the question, depth, and ordered research plan |
| `deep_research_add_evidence` | Append a source name, optional URL, and evidence summary |
| `deep_research_complete` | Save the synthesized report and mark the project complete |
| `deep_research_list` | List projects, optionally filtering by text or phase |

The Web client queries and creates projects through the package-owned `remote.deepResearch` namespace.

## 🧩 Independence

Deep Research has no Notebooks or Ultra UI dependency. It only composes host Web/subagent capabilities and independently owns workflow data, model tools, Remote methods, and its conversation view.

## 💾 Data and Configuration

The default patch permits 1,000 projects, 200 evidence records per project, and 200,000 report characters. Records use the active profile's `storage-domain` backend. Completed projects reject additional evidence.

## 🧪 Verification and Development

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/deepresearch.spec.ts
pnpm --filter @deepseek-ai/dsh-deepresearch run bundle
```

Installable `lib/` artifacts are committed; run `npm run verify` for a syntax check.

## ⚠️ Known Limitations

- The plugin records orchestration state but does not execute searches or launch subagents itself.
- Evidence is append-only, and completed projects cannot accept more evidence.
- Source fields and workflow guidance do not automatically validate URL contents or source quality.
- This is the standalone distribution of the corresponding extension developed in the private Harness source tree.
