import { createAgent } from "./agent.js";
import { startRepl } from "./repl.js";

// ---- Validate environment ----
const apiKey = process.env.DASHSCOPE_API_KEY;
if (!apiKey) {
  console.error("Error: DASHSCOPE_API_KEY environment variable is not set.");
  process.exit(1);
}

// ---- Banner ----
console.log("=== Simple AI Agent (Qwen3.6-Plus via DashScope) ===");
console.log("Tools: pwd, ls, cat, grep");
console.log('Type your message, press Enter to send. Type "exit" to quit.\n');

// ---- Start ----
const agent = createAgent(apiKey);
startRepl(agent);
