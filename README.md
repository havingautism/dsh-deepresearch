# 🔬 Deep Research

[English](README.en.md) | 中文

`@deepseek-ai/dsh-deepresearch` 把证据优先的 Codemini 研究工作区带到 DSH。它提供持久工作流状态、模型工具、生成的 `deepResearch` Remote namespace 和“深度研究”Web 工作区，同时组合宿主已有的 Web 与 subagent 能力。

## ✨ 特性

- 🧭 记录研究问题、目标、约束、种子材料和研究深度。
- 🧩 确认前编辑子问题、依赖关系和明确的成功标准。
- ✅ 未确认计划时拒绝写入证据。
- 🔎 为每个子问题关联论点、摘录、URL、置信度和已覆盖标准。
- 📊 跟踪问题覆盖度、搜索与抓取预算、局限和部分完成状态。
- 📝 保存结论，以及完整或明确标记为未完成的最终报告。
- 🗂️ 在 Web 资料库中搜索、筛选、排序、恢复、中止或删除项目。
- 🤖 创建项目后由私有规划 Agent 只提交计划；确认后再按子问题并行派出 Scout / Evaluator，最后用写作包撰写报告。普通聊天不挂研究工具，也不开通用 fetch。项目持久化在 SQLite（`~/.dsh/storages/deepresearch.sqlite`）；首次启动会导入旧的 JSON 文件。
- 🔄 研究页每 750ms 刷新 `progress`：题列表、Scout 卡（工具 fuse、最近检索/抓取、核验、handoff）和已接受证据。
- ✨ 对齐 Codemini 的研究 Modal、加载动效和各场景按钮形态。

## 🚀 快速开始

安装插件：

```sh
dsh plugin --profile web add github:havingautism/dsh-deepresearch
dsh web
```

在左侧边栏底部打开「深度研究」，创建项目。插件会在后台建立仅供研究使用的 DSH Agent 来生成计划；页面持续刷新，计划生成后可编辑并确认。点击“确认并开始”会建立新的私有调查 Agent，使用该 profile 已安装的 Web 与 subagent 能力，并把每次检索、证据、覆盖状态和最终报告写回研究工作区。普通聊天不会收到研究 prompt、工具调用或模型输出。插件 patch 显式启用 runner，并设置项目、问题、标准、证据和报告上限。

私有研究 Session 会记录宿主启动目录作为 `cwd`，以便 DSH persona 和运行时上下文可以完整装配。规划失败会停留在“计划”步骤并显示持久化错误，不会跳到空的调查看板。

## 网页抓取与安全

DSH 默认不挂载 fetch provider、不开放聊天 `web_fetch`（见 [dsh-base `cordis.patch.yml`](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/bundle/base/cordis.patch.yml#L396-L418)）。本插件 patch **会 insert** `@deepseek-ai/dsh-web-fetch-http`（loader id：`web-fetch-http`），供私有 Scout 的 `research_web_fetch` 与宿主 `ctx.web.fetch` 使用。

若同时安装 `@deepseek-ai/dsh-notebooks`，**只需这一处 insert**；随手记 patch 不再重复挂载，两个插件共用同一份 provider。单独安装深度研究时，由本插件提供 fetch。

安装即表示你接受网页抓取带来的 SSRF 类风险；请在可信环境使用。详见 [Web 默认搜索决策说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/.agents/notes/implemented/feature/2026-07-31-web-default-search.zh.md)。

## 模型体验

### System prompt

#### What the model sees

只有插件创建的私有规划/调查 Agent 会收到对应阶段的研究工作流指引。

规划 Agent 只挂 `deep_research_submit_plan`。调查由编排器按标准派出 Scout（`research_web_search` / `research_web_fetch` / `read_artifact` / `submit_criterion_candidates`）和 Evaluator（`read_artifact` / `submit_criterion_review`）；Writer 只挂 `deep_research_complete`，按写作包 URL 标源。普通聊天不继承这些工具。

#### Token effect

固定输入成本只由私有研究 Agent 的请求承担；普通聊天请求不增加这段指引。

#### KV Cache 影响

文本和注册作用域不变时，本节保持前缀稳定。

### Native 工具

#### What the model sees

每个私有 Agent 只看到当前角色的工具；状态由编排器写入 SQLite 项目表。Remote 客户端负责创建、编辑、确认、停止、读取和删除项目。

#### Token effect

工具可见时承担固定 schema 成本。工具结果采用精简项目摘要；持久证据和报告受配置上限约束。

#### KV Cache 影响

工具定义不变时保持稳定。新证据通过后续调用与结果进入请求，不会重写之前的请求内容。

## 已知限制与后续工作

- 运行中的私有 Agent 会随宿主进程停止；项目、证据和报告保持持久化，但进程重启后不会自动续跑中断的任务。
- 证据只追加不编辑。错误论点应通过新项目重新调查，或在依赖报告前删除原项目。
