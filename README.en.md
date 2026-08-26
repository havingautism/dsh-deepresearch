# 🔬 Deep Research

English | [中文](README.md)

`@deepseek-ai/dsh-deepresearch` brings the evidence-first Codemini research workspace to DSH. It provides durable workflow state, model tools, the generated `deepResearch` Remote namespace, and the `深度研究` Web workspace while composing the host's existing Web and subagent capabilities.

## ✨ Features

- 🧭 Capture the research question, goal, constraints, seed material, and depth.
- 🧩 Edit sub-questions, dependencies, and explicit success criteria before confirmation.
- ✅ Require plan confirmation before evidence can be recorded.
- 🔎 Attach claims, snippets, URLs, confidence, and covered criteria to each sub-question.
- 📊 Track question coverage, search/fetch budgets, limitations, and partial completion.
- 📝 Save conclusions and a full or explicitly incomplete final report.
- 🗂️ Search, filter, sort, resume, abort, or delete projects from the Web library.
- 🤖 Planning submits a reviewable plan only. Confirming starts Scout / Evaluator per criterion (max 3 questions in parallel), then a Writer that cites writing-pack URLs. Normal chat does not inherit research tools or generic fetch. Projects persist in SQLite (`~/.dsh/storages/deepresearch.sqlite`); a leftover JSON unit is imported on first launch.
- 🔄 The research view polls `progress` every 750ms and draws the question list plus Scout cards (fuse, recent tools, verification, handoff).
- ✨ Match Codemini's research modal, loading motion, and context-specific button shapes.

## 🚀 Quick Start

Install this bundle by itself:

```sh
dsh plugin --profile web add github:havingautism/dsh-deepresearch
dsh web
```

Open **Deep Research** from the sidebar footer and create a project. The plugin creates a research-only DSH Agent to generate the plan while the page refreshes. Review or edit that plan, then choose “Confirm & start” to launch a new private investigation Agent. It uses the profile's Web and subagent capabilities and writes searches, evidence, coverage, and the final report back to the research workspace. The normal chat receives no research prompt, tool calls, or model output. The patch enables the runner and sets explicit limits for projects, questions, criteria, evidence, and reports. A deepresearch-only install is enough — you do not need Notebooks or a hand-written yml.

Private research sessions record the host launch directory as `cwd` so DSH can assemble the persona and runtime context. A planning failure stays on the Plan step and displays the persisted error instead of opening an empty investigation board.

At boot, if the host has no sqlite / HTTP fetch yet, this plugin mounts them; if they already exist, it reuses them. Research data lives in the `deepresearch` domain on that sqlite backend.

## Web fetch and security

DSH does not mount a fetch provider or expose chat `web_fetch` by default (see [dsh-base `cordis.patch.yml`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/base/cordis.patch.yml#L396-L418)). At boot this plugin mounts `@deepseek-ai/dsh-web-fetch-http` when it is missing, for private Scout `research_web_fetch` and host `ctx.web.fetch`; an already-mounted provider is left alone. Installing alongside `@deepseek-ai/dsh-notebooks` therefore does not duplicate loader ids. Chat `web_fetch` stays off.

Installing it opts into web retrieval and associated SSRF-style risk. Use in a trusted environment. See the [default Web search decision note](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-31-web-default-search.md).

## Model Experience

### System prompt

#### What the model sees

Only the private planning and investigation Agents receive their phase-specific research guidance.

The planning Agent only has `deep_research_submit_plan`. The orchestrator then spawns Scout (`research_web_search` / `research_web_fetch` / `read_artifact` / `submit_criterion_candidates`) and Evaluator (`read_artifact` / `submit_criterion_review`) roles. The Writer only has `deep_research_complete` and must cite URLs from the writing pack.

#### Token effect

The fixed input cost applies only to private research Agent requests, not ordinary chat requests.

#### KV Cache effect

The section remains prefix-stable while its text and registration scope are unchanged.

### Native tools

#### What the model sees

Each private Agent sees only its role tools. The orchestrator writes durable state. Remote clients create, edit, confirm, stop, inspect, and delete projects.

#### Token effect

Fixed schema cost applies while the tools are visible. Tool results are concise project summaries; durable evidence and reports remain bounded by configuration.

#### KV Cache effect

Tool definitions are stable while unchanged. New evidence arrives through later calls and results rather than rewriting earlier request content.

## Known Limitations and Deferred Work

- Private Agents stop with the Host process. Projects, evidence, and reports remain durable, but an interrupted run does not resume automatically after restart.
- Evidence is append-only. Correct a mistaken claim by starting a new project or deleting the project before relying on its report.
