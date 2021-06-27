// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/process_queue.ts


import { loopObject } from "../util/loop_object.ts";
import { delay } from "../util/utils.ts";
import { ws } from "./ws.ts";

export async function processQueue(id: number) {
  const shard = ws.shards.get(id);
  // If no items or its already processing then exit
  if (!shard?.queue.length || shard.processingQueue) return;

  shard.processingQueue = true;

  while (shard.queue.length) {
    if (shard.ws.readyState !== WebSocket.OPEN) {
      shard.processingQueue = false;
      return;
    }

    const now = Date.now();
    if (now - shard.queueStartedAt >= 60000) {
      shard.queueStartedAt = now;
      shard.queueCounter = 0;
    }

    // Send a request that is next in line
    const request = shard.queue.shift();
    if (!request) return;

    if (request?.d) {
      request.d = loopObject(
        request.d as Record<string, unknown>,
        (value) =>
          typeof value === "bigint"
            ? value.toString()
            : Array.isArray(value)
            ? value.map((v) => (typeof v === "bigint" ? v.toString() : v))
            : value,
        `Running forEach loop in ws.processQueue function for changing bigints to strings.`
      );
    }

    ws.log("RAW_SEND", shard.id, request);

    shard.ws.send(JSON.stringify(request));

    // Counter is useful for preventing 120/m requests.
    shard.queueCounter++;

    // Handle if the requests have been maxed
    if (shard.queueCounter >= 118) {
      ws.log("DEBUG", {
        message: "Max gateway requests per minute reached setting timeout for one minute",
        shardId: shard.id,
      });
      await delay(60000);
      shard.queueCounter = 0;
      continue;
    }
  }

  shard.processingQueue = false;
}
