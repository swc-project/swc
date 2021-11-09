// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/cleanup_loading_shards.ts


import { delay } from "../util/utils.ts";
import { ws } from "./ws.ts";

/** The handler to clean up shards that identified but never received a READY. */
export async function cleanupLoadingShards() {
  while (ws.loadingShards.size) {
    ws.log("DEBUG", "Running while loop in cleanupLoadingShards function.");
    const now = Date.now();
    ws.loadingShards.forEach((loadingShard) => {
      ws.log("DEBUG", `Running forEach loop in cleanupLoadingShards function.`);
      // Not a minute yet. Max should be few seconds but do a minute to be safe.
      if (now < loadingShard.startedAt + 60000) return;

      loadingShard.reject(
        `[Identify Failure] Shard ${loadingShard.shardId} has not received READY event in over a minute.`
      );
    });

    await delay(1000);
  }
}
