import { createInterface } from "readline";

type Request = {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, unknown>;
};

type Notification = {
  jsonrpc: "2.0";
  method: string;
  params?: Record<string, unknown>;
};

type Message = Request | Notification;

function respond(id: number, result: unknown) {
  process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id, result }) + "\n");
}

function error(id: number, code: number, message: string) {
  process.stdout.write(
    JSON.stringify({ jsonrpc: "2.0", id, error: { code, message } }) + "\n",
  );
}

export function start(handleRequest: (method: string, params: Record<string, unknown> | undefined) => Promise<unknown>) {
  const rl = createInterface({ input: process.stdin });

  rl.on("line", async (line) => {
    let msg: Message;
    try {
      msg = JSON.parse(line);
    } catch {
      return;
    }

    if (msg.jsonrpc !== "2.0") return;

    if ("id" in msg) {
      try {
        const result = await handleRequest(msg.method, msg.params);
        respond(msg.id, result);
      } catch (e) {
        error(msg.id, -32603, e instanceof Error ? e.message : "Internal error");
      }
    }
  });
}
