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

## 🚀 Quick Start

Install this bundle by itself:

```sh
dsh plugin --profile web add github:havingautism/dsh-deepresearch
dsh web
```

Open the `深度研究` tab, create a project, review its plan, and confirm it before investigation. The patch sets explicit limits for projects, questions, criteria, evidence, and reports.

## Model Experience

### System prompt

#### What the model sees

Every active request receives the research workflow guidance below.

##### Research workflow guidance

```markdown
For explicit deep research, create or resume a project before investigation. Refine and confirm its question plan, then use the composed Web and subagent tools. Save each source-backed claim against its sub-question and success criteria. Mark coverage honestly, retain limitations, and save the final report only after comparing accepted evidence. Never invent sources, evidence, coverage, or completion.
```

#### Token effect

Small fixed input cost applies while the plugin is active.

#### KV Cache effect

The section remains prefix-stable while its text and registration scope are unchanged.

### Native tools

#### What the model sees

The model sees `deep_research_start`, `deep_research_list`, `deep_research_confirm_plan`, `deep_research_add_evidence`, `deep_research_update_coverage`, and `deep_research_complete`. Remote clients additionally edit draft plans, stop runs, inspect full projects, and delete them.

#### Token effect

Fixed schema cost applies while the tools are visible. Tool results are concise project summaries; durable evidence and reports remain bounded by configuration.

#### KV Cache effect

Tool definitions are stable while unchanged. New evidence arrives through later calls and results rather than rewriting earlier request content.

## Known Limitations and Deferred Work

- The plugin records and validates orchestration state but does not schedule searches itself; installed Web or subagent capabilities perform investigation.
- Search and fetch budgets are planning metadata in this release; automatic consumption requires integrations from those capability providers.
- Evidence is append-only. Correct a mistaken claim by starting a new project or deleting the project before relying on its report.
