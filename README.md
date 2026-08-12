# 🔬 dsh-deepresearch · 深度研究

[English](README.en.md) | 中文

> DeepSeek Harness 的独立证据优先研究插件。研究工具、持久工作流、类型化 Remote API 和“深度研究”Web 会话页都由本仓库自行提供。

**状态** Preview · **版本** 0.1.0 · **分支** `main`

## ✨ 特性

- 🧭 先把问题转成显式、可恢复的研究计划。
- 🔎 保存来源、证据摘要、研究阶段和最终报告。
- 🤖 提供 start、add evidence、complete、list 四个模型原生研究工具。
- 💬 自带“深度研究”Web 会话页，可查看项目并发起新计划。
- 🧰 组合当前 profile 已有的 Web 与 subagent 能力，不维护第二套 runner。

## 🚀 快速开始

只安装本插件即可获得完整研究工作流：

```sh
dsh plugin --profile web add github:dsh-external/dsh-deepresearch
dsh web
```

打开 Web 后会出现“深度研究”会话页。也可以直接输入：

```text
对“模型工具调用 UI 如何保证实时态与回放态一致”做一次深度研究。先列计划，每条结论必须记录来源，最后比较证据并说明不确定性。
```

正常流程会使用 `deep_research_start`、当前 Web/subagent 工具、`deep_research_add_evidence` 和 `deep_research_complete`；新会话可用 `deep_research_list` 恢复项目。

## 🛠️ 工具与 API

| 工具 | 用途 |
| --- | --- |
| `deep_research_start` | 保存问题、深度和有序研究计划 |
| `deep_research_add_evidence` | 追加来源名称、可选 URL 和证据摘要 |
| `deep_research_complete` | 保存综合报告并把项目置为 complete |
| `deep_research_list` | 列出项目，可按文本或阶段筛选 |

Web 端通过本插件挂载的 `remote.deepResearch` namespace 查询与创建项目。

## 🧩 独立性

Deep Research 不依赖 Notebooks 或 Ultra UI。它只组合宿主已有的 Web/subagent 能力，并独立持有工作流数据、模型工具、Remote 方法和“深度研究”会话页。

## 💾 数据与配置

默认补丁限制为 1000 个项目、每项目 200 条证据、报告 200000 字符。记录使用当前 profile 的 `storage-domain` 后端；完成后的项目拒绝继续追加证据。

## 🧪 验证与开发

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/deepresearch.spec.ts
pnpm --filter @deepseek-ai/dsh-deepresearch run bundle
```

本仓库提交了可直接安装的 `lib/`；运行 `npm run verify` 可检查发布产物语法。

## ⚠️ 已知限制

- 插件记录研究编排状态，但不会自行执行搜索或启动 subagent。
- 证据当前只追加、不编辑；项目完成后不可继续追加。
- 来源字段与工作流约束不会自动验证 URL 内容或来源质量。
- 本仓库是 Harness 私有主仓对应扩展包的独立分发仓库。
