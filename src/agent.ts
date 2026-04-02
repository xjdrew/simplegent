import { Agent, type AgentEvent } from "@mariozechner/pi-agent-core";
import { qwenModel } from "./model.js";
import { tools } from "./tools.js";

const SYSTEM_PROMPT = `你是一个有用的AI助手，可以使用以下工具分析本地文件系统：
- pwd: 显示当前工作目录
- ls: 列出目录内容
- cat: 查看文件内容
- grep: 搜索文件内容
请根据用户需求选择合适的工具。`;

export type AgentEventCallback = (event: AgentEvent) => void;

export function createAgent(apiKey: string) {
  const agent = new Agent({
    initialState: {
      systemPrompt: SYSTEM_PROMPT,
      model: qwenModel,
      tools,
    },
    getApiKey: async () => apiKey,
  });

  return agent;
}
