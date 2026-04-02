# Simple AI Agent

基于 [@mariozechner/pi-agent-core](https://github.com/badlogic/pi-mono) 的最简 AI Agent 示例，使用阿里百炼 Qwen3.6-Plus 模型，支持本地工具调用。

## 功能

通过自然语言与 AI 交互，AI 可以调用以下工具分析本地文件系统：

| 工具 | 说明 |
|------|------|
| `pwd` | 显示当前工作目录 |
| `ls` | 列出目录内容，支持 `-la` 等参数 |
| `cat` | 查看文件内容 |
| `grep` | 搜索文件内容，支持 `-rn` 等参数 |

## 快速开始

```bash
# 安装依赖
npm install

# 设置 API Key（从阿里百炼获取）
export DASHSCOPE_API_KEY="sk-xxx"

# 启动
npm start
```

## 使用示例

```
You: 帮我看看当前目录有哪些文件
[ls] {"path":".","flags":"-la"}
[ls done]
Assistant: 当前目录包含以下文件...

You: 查看 package.json 的内容
[cat] {"path":"package.json"}
[cat done]
Assistant: package.json 的内容如下...

You: 在 src 目录下搜索 agent 关键字
[grep] {"pattern":"agent","path":"src/","flags":"-rn"}
[grep done]
Assistant: 搜索结果如下...

You: exit
Bye!
```

## 项目结构

```
src/
├── index.ts    # 入口：环境校验，启动 REPL
├── model.ts    # Qwen3.6-Plus 模型配置
├── tools.ts    # 工具定义 (pwd, ls, cat, grep)
├── agent.ts    # Agent 创建与系统提示词
└── repl.ts     # 交互式 REPL，Spinner 动画
```
