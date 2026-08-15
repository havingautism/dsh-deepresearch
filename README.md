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

## 🚀 快速开始

安装插件：

```sh
dsh plugin --profile web add github:havingautism/dsh-deepresearch
dsh web
```

打开“深度研究”标签页，创建项目、审阅计划，并在调查前确认。插件 patch 显式设置项目、问题、标准、证据和报告上限。

## 模型体验

### System prompt

#### What the model sees

插件激活期间，每个请求都会收到下面的研究工作流指引。

##### 研究工作流指引

```markdown
For explicit deep research, create or resume a project before investigation. Refine and confirm its question plan, then use the composed Web and subagent tools. Save each source-backed claim against its sub-question and success criteria. Mark coverage honestly, retain limitations, and save the final report only after comparing accepted evidence. Never invent sources, evidence, coverage, or completion.
```

#### Token effect

插件激活期间每个请求承担固定的小额输入成本。

#### KV Cache 影响

文本和注册作用域不变时，本节保持前缀稳定。

### Native 工具

#### What the model sees

模型会看到 `deep_research_start`、`deep_research_list`、`deep_research_confirm_plan`、`deep_research_add_evidence`、`deep_research_update_coverage` 和 `deep_research_complete`。Remote 客户端还可编辑草案计划、停止任务、读取完整项目和删除项目。

#### Token effect

工具可见时承担固定 schema 成本。工具结果采用精简项目摘要；持久证据和报告受配置上限约束。

#### KV Cache 影响

工具定义不变时保持稳定。新证据通过后续调用与结果进入请求，不会重写之前的请求内容。

## 已知限制与后续工作

- 插件记录并校验编排状态，但不自行调度搜索；调查由已安装的 Web 或 subagent 能力执行。
- 本版搜索与抓取预算属于计划元数据；自动扣减需要相应能力 provider 提供集成。
- 证据只追加不编辑。错误论点应通过新项目重新调查，或在依赖报告前删除原项目。
