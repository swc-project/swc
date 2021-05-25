// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/resharder.ts


import { getGatewayBot } from "../helpers/misc/get_gateway_bot.ts";
import { ws } from "./ws.ts";

/** The handler to automatically reshard when necessary. */
export async function resharder() {
  ws.botGatewayData = await getGatewayBot();

  const percentage = ((ws.botGatewayData.shards - ws.maxShards) / ws.maxShards) * 100;
  // Less than necessary% being used so do nothing
  if (percentage < ws.reshardPercentage) return;

  // Don't have enough identify rate limits to reshard
  if (ws.botGatewayData.sessionStartLimit.remaining < ws.botGatewayData.shards) {
    return;
  }

  // Begin resharding
  ws.maxShards = ws.botGatewayData.shards;
  // If more than 100K servers, begin switching to 16x sharding
  if (ws.maxShards && ws.useOptimalLargeBotSharding) {
    ws.maxShards = Math.ceil(
      ws.maxShards /
        (ws.botGatewayData.sessionStartLimit.maxConcurrency === 1
          ? 16
          : ws.botGatewayData.sessionStartLimit.maxConcurrency)
    );
  }

  ws.spawnShards(ws.firstShardId);
}
