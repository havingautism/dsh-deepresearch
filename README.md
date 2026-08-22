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
- 🤖 创建项目后由私有 DSH Agent 生成可审查计划；“确认并开始”再启动独立调查 Agent，不占用普通聊天会话。
- 🔄 研究页在运行阶段持续刷新，实时显示检索预算、子问题、证据、覆盖度和报告阶段。
- ✨ 对齐 Codemini 的研究 Modal、加载动效和各场景按钮形态。

## 🚀 快速开始

安装插件：

```sh
dsh plugin --profile web add github:havingautism/dsh-deepresearch
dsh web
```

打开“深度研究”标签页并创建项目。插件会在后台建立仅供研究使用的 DSH Agent 来生成计划；页面持续刷新，计划生成后可编辑并确认。点击“确认并开始”会建立新的私有调查 Agent，使用该 profile 已安装的 Web 与 subagent 能力，并把每次检索、证据、覆盖状态和最终报告写回研究工作区。普通聊天不会收到研究 prompt、工具调用或模型输出。插件 patch 显式启用 runner，并设置项目、问题、标准、证据和报告上限。

私有研究 Session 会记录宿主启动目录作为 `cwd`，以便 DSH persona 和运行时上下文可以完整装配。规划失败会停留在“计划”步骤并显示持久化错误，不会跳到空的调查看板。

## 模型体验

### System prompt

#### What the model sees

只有插件创建的私有规划/调查 Agent 会收到对应阶段的研究工作流指引。

规划 Agent 只能读取指定项目并提交可审查计划；调查 Agent 只能处理同一项目，使用 Web 工具保存来源证据、更新覆盖度并提交带引用的报告。两者都禁止向普通聊天输出结果、虚构来源或跳过持久状态写入。

#### Token effect

固定输入成本只由私有研究 Agent 的请求承担；普通聊天请求不增加这段指引。

#### KV Cache 影响

文本和注册作用域不变时，本节保持前缀稳定。

### Native 工具

#### What the model sees

私有研究 Agent 会看到阶段所需的 `deep_research_get`、`deep_research_submit_plan`、`deep_research_add_evidence`、`deep_research_update_coverage` 和 `deep_research_complete`。这些工具按 Agent scope 注册，不会泄漏到普通聊天。Remote 客户端负责创建、编辑、确认、停止、读取和删除项目。

#### Token effect

工具可见时承担固定 schema 成本。工具结果采用精简项目摘要；持久证据和报告受配置上限约束。

#### KV Cache 影响

工具定义不变时保持稳定。新证据通过后续调用与结果进入请求，不会重写之前的请求内容。

## 已知限制与后续工作

- 运行中的私有 Agent 会随宿主进程停止；项目、证据和报告保持持久化，但进程重启后不会自动续跑中断的任务。
- 证据只追加不编辑。错误论点应通过新项目重新调查，或在依赖报告前删除原项目。
