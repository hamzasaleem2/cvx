import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { start } from "../mcp/server.js";
import { listTools, callTool } from "../mcp/tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), "utf-8"));

export function run() {
  let initialized = false;

  start(async (method: string, params: Record<string, unknown> | undefined) => {
    switch (method) {
      case "initialize":
        initialized = true;
        return {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: {
            name: "cvx",
            version,
          },
        };

      case "tools/list":
        return listTools();

      case "tools/call":
        if (!initialized) throw new Error("Not initialized");
        return callTool(params?.name as string, (params?.arguments as Record<string, unknown>) || {});

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  });
}
