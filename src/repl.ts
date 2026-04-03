import * as readline from "readline";
import type { Agent } from "@mariozechner/pi-agent-core";

// ---- Spinner ----
const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

class Spinner {
  private timer: ReturnType<typeof setInterval> | null = null;
  private frameIndex = 0;
  private label: string;

  constructor(label = "Thinking") {
    this.label = label;
  }

  start() {
    this.frameIndex = 0;
    this.render();
    this.timer = setInterval(() => this.render(), 80);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      // Clear the spinner line
      process.stdout.write("\r\x1b[K");
    }
  }

  private render() {
    const frame = SPINNER_FRAMES[this.frameIndex % SPINNER_FRAMES.length];
    process.stdout.write(`\r\x1b[K\x1b[36m${frame}\x1b[0m ${this.label}...`);
    this.frameIndex++;
  }
}

// ---- REPL ----
export function startRepl(agent: Agent) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const spinner = new Spinner();
  let firstTextInTurn = false;

  // Subscribe to agent events
  agent.subscribe((event) => {
    switch (event.type) {
      case "message_update":
        if (event.assistantMessageEvent.type === "text_delta") {
          if (!firstTextInTurn) {
            firstTextInTurn = true;
            spinner.stop();
            process.stdout.write("\x1b[32mAssistant:\x1b[0m ");
          }
          process.stdout.write(event.assistantMessageEvent.delta);
        }
        break;

      case "tool_execution_start":
        spinner.stop();
        console.log(
          `\x1b[33m[${event.toolName}]\x1b[0m ${JSON.stringify(event.args)}`
        );
        break;

      case "tool_execution_end":
        if (event.isError) {
          console.log(`\x1b[31m[${event.toolName} error]\x1b[0m`);
        } else {
          console.log(`\x1b[32m[${event.toolName} done]\x1b[0m`);
        }
        // Restart spinner while waiting for next LLM response
        spinner.start();
        break;

      case "agent_end":
        spinner.stop();
        console.log();
        // Re-enable input
        rl.resume();
        ask();
        break;
    }
  });

  function ask() {
    rl.question("\x1b[34mYou:\x1b[0m ", async (input) => {
      const trimmed = input.trim();

      if (trimmed.toLowerCase() === "exit") {
        console.log("Bye!");
        rl.close();
        process.exit(0);
      }

      if (!trimmed) {
        ask();
        return;
      }

      // Block input and start spinner
      rl.pause();
      firstTextInTurn = false;
      spinner.start();

      try {
        await agent.prompt(trimmed);
      } catch (err: any) {
        spinner.stop();
        console.error(`\n\x1b[31mError: ${err.message}\x1b[0m`);
        rl.resume();
        ask();
      }
    });
  }

  // Start
  ask();
}
