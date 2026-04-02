import type { Model } from "@mariozechner/pi-ai";

export const qwenModel: Model<"openai-completions"> = {
  id: "qwen3.6-plus",
  name: "Qwen3.6-Plus",
  api: "openai-completions",
  provider: "dashscope",
  baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 131072,
  maxTokens: 8192,
  compat: {
    supportsDeveloperRole: false,
    supportsStore: false,
    supportsStrictMode: false,
    maxTokensField: "max_tokens",
  },
};
