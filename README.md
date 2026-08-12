# dsh-deepresearch · 深度研究

[English](README.en.md) | 中文

> DeepSeek Harness 的证据优先深度研究工作流。它复用 Harness 已有的 Web 与 subagent 能力，把研究计划、来源证据、阶段和最终报告保存成可恢复、可审查的数据。

**状态** Preview · **版本** 0.1.0 · **分支** `main`

## 特性

- **证据优先**：先创建研究项目，再收集来源，最后综合报告。
- **跨会话恢复**：计划、证据、阶段和报告由 storage domain 持久化。
- **组合现有能力**：搜索与并行探索继续使用当前 profile 的 Web/subagent 工具。
- **模型原生工具**：提供 start、add evidence、complete、list 四个研究工具。
- **独立 Web Remote**：插件自行挂载 `remote.deepResearch`，供 UI 查询与发起项目。
- **状态约束**：完成后的项目拒绝继续追加证据。

## 快速开始

```sh
dsh plugin --profile web add github:dsh-external/dsh-deepresearch
dsh web
```

然后输入：

```text
对“模型工具调用 UI 如何保证实时态与回放态一致”做一次深度研究。先列计划，每条结论必须记录来源，最后比较证据并说明不确定性。
```

正常流程会依次使用 `deep_research_start`、当前 Web/subagent 工具、`deep_research_add_evidence` 和 `deep_research_complete`；新会话可用 `deep_research_list` 恢复项目。

如果希望在 Web 中查看研究卡片和发起研究，再安装 [dsh-ultra-ui](https://github.com/dsh-external/dsh-ultra-ui)。

## 工具

| 工具 | 用途 |
| --- | --- |
| `deep_research_start` | 保存问题、深度（quick/standard/deep）和研究计划 |
| `deep_research_add_evidence` | 追加来源名称、可选 URL 和证据摘要 |
| `deep_research_complete` | 保存综合报告并把项目置为 complete |
| `deep_research_list` | 列出项目，可按查询文本或阶段筛选 |

插件还向模型提供一段短工作流指引：显式深度研究请求必须先建项目，只保存有来源的发现，并在完成前比较证据、说明不确定性。

## 数据与配置

默认补丁限制为 1000 个项目、每项目 200 条证据、报告 200000 字符。记录使用 profile 的 `storage-domain` 后端；插件本身不维护第二套搜索引擎或任务调度器。

## 验证与开发

```sh
pnpm exec tsc -b tsconfig.host.json tsconfig.client.json --pretty false
pnpm exec vitest run packages/extensions/deepresearch/tests/extensions.spec.ts
pnpm --filter @deepseek-ai/dsh-deepresearch bundle -- --env.DSH_BUILD_FACE=client
```

本仓提交了可直接安装的 `lib/`；可用 `npm run verify` 检查发布产物语法。

## 已知限制

- 插件记录研究编排状态，但不会自行执行搜索或启动 subagent。
- 证据当前只追加、不编辑；项目完成后不可继续追加。
- 来源字段与工作流约束不等于自动验证 URL 内容或来源质量。
- 本仓是 Harness 私有主仓中对应扩展包的独立分发仓库。
