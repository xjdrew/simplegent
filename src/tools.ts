import type { AgentTool } from "@mariozechner/pi-agent-core";
import { Type } from "@mariozechner/pi-ai";
import { readFile } from "fs/promises";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ---- pwd ----
const pwdParams = Type.Object({});

const pwdTool: AgentTool<typeof pwdParams> = {
  name: "pwd",
  label: "Working Directory",
  description: "Print the current working directory.",
  parameters: pwdParams,
  execute: async () => {
    const cwd = process.cwd();
    return {
      content: [{ type: "text" as const, text: cwd }],
      details: { cwd },
    };
  },
};

// ---- ls ----
const lsParams = Type.Object({
  path: Type.String({
    description: 'Directory path to list, e.g. /home/user or "."',
  }),
  flags: Type.Optional(
    Type.String({ description: "Optional flags, e.g. -la, -lh" })
  ),
});

const lsTool: AgentTool<typeof lsParams> = {
  name: "ls",
  label: "List Files",
  description:
    "List files and directories in a specified path on the local filesystem.",
  parameters: lsParams,
  execute: async (_id, params) => {
    const args = [params.flags, params.path].filter(Boolean).join(" ");
    const { stdout, stderr } = await execAsync(`ls ${args}`);
    return {
      content: [{ type: "text" as const, text: stdout || stderr }],
      details: { command: `ls ${args}` },
    };
  },
};

// ---- cat ----
const catParams = Type.Object({
  path: Type.String({ description: "File path to read" }),
});

const catTool: AgentTool<typeof catParams> = {
  name: "cat",
  label: "Read File",
  description: "Read and display the contents of a file.",
  parameters: catParams,
  execute: async (_id, params) => {
    const content = await readFile(params.path, "utf-8");
    return {
      content: [{ type: "text" as const, text: content }],
      details: { path: params.path, size: content.length },
    };
  },
};

// ---- grep ----
const grepParams = Type.Object({
  pattern: Type.String({ description: "Search pattern (regex supported)" }),
  path: Type.String({ description: "File or directory path to search in" }),
  flags: Type.Optional(
    Type.String({
      description: "Optional flags, e.g. -rn (recursive + line numbers), -i (case insensitive)",
    })
  ),
});

const grepTool: AgentTool<typeof grepParams> = {
  name: "grep",
  label: "Search Content",
  description:
    "Search for a pattern in files. Supports regex. Use flags like -rn for recursive search with line numbers.",
  parameters: grepParams,
  execute: async (_id, params) => {
    const args = [params.flags, JSON.stringify(params.pattern), params.path]
      .filter(Boolean)
      .join(" ");
    try {
      const { stdout } = await execAsync(`grep ${args}`);
      return {
        content: [{ type: "text" as const, text: stdout || "(no matches)" }],
        details: { command: `grep ${args}` },
      };
    } catch (err: any) {
      // grep exits with code 1 when no matches found
      if (err.code === 1) {
        return {
          content: [{ type: "text" as const, text: "(no matches)" }],
          details: { command: `grep ${args}` },
        };
      }
      throw err;
    }
  },
};

export const tools = [pwdTool, lsTool, catTool, grepTool];
