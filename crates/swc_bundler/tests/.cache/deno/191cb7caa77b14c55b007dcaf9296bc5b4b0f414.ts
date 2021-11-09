// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/start_gateway.ts


import { DiscordGatewayIntents } from "../types/gateway/gateway_intents.ts";
import type { GetGatewayBot } from "../types/gateway/get_gateway_bot.ts";
import { camelize } from "../util/utils.ts";
import { StartGatewayOptions } from "./start_gateway_options.ts";
import { ws } from "./ws.ts";

/** ADVANCED DEVS ONLY!!!!!!
 * Starts the standalone gateway.
 * This will require starting the bot separately.
 */
export async function startGateway(options: StartGatewayOptions) {
  ws.identifyPayload.token = `Bot ${options.token}`;
  ws.secretKey = options.secretKey;
  ws.firstShardId = options.firstShardId;
  ws.url = options.url;
  if (options.shardsPerCluster) ws.shardsPerCluster = options.shardsPerCluster;
  if (options.maxClusters) ws.maxClusters = options.maxClusters;

  if (options.compress) {
    ws.identifyPayload.compress = options.compress;
  }
  if (options.reshard) ws.reshard = options.reshard;
  // Once an hour check if resharding is necessary
  setInterval(ws.resharder, 1000 * 60 * 60);

  ws.identifyPayload.intents = options.intents.reduce(
    (bits, next) => (bits |= typeof next === "string" ? DiscordGatewayIntents[next] : next),
    0
  );

  ws.botGatewayData = camelize(
    await fetch(`https://discord.com/api/gateway/bot`, {
      headers: { Authorization: ws.identifyPayload.token },
    }).then((res) => res.json())
  ) as GetGatewayBot;

  ws.maxShards = options.maxShards || ws.botGatewayData.shards;
  ws.lastShardId = options.lastShardId || ws.botGatewayData.shards - 1;

  ws.spawnShards(ws.firstShardId);
  await ws.cleanupLoadingShards();
}
