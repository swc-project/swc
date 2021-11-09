// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/misc/READY.ts


import { eventHandlers, setApplicationId, setBotId } from "../../bot.ts";
import { cache } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { Ready } from "../../types/gateway/ready.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { DiscordenoShard, ws } from "../../ws/ws.ts";

export function handleReady(data: DiscordGatewayPayload, shardId: number) {
  // Triggered on each shard
  eventHandlers.shardReady?.(shardId);

  // The bot has already started, the last shard is resumed, however.
  if (cache.isReady) return;

  const shard = ws.shards.get(shardId);
  if (!shard) return;

  const payload = data.d as Ready;
  setBotId(payload.user.id);
  setApplicationId(payload.application.id);

  // Set ready to false just to go sure
  shard.ready = false;
  // All guilds are unavailable at first
  shard.unavailableGuildIds = new Set(payload.guilds.map((g) => snowflakeToBigint(g.id)));
  // Set the last available to now
  shard.lastAvailable = Date.now();

  // Start ready check in 2 seconds
  setTimeout(() => {
    eventHandlers.debug?.("loop", `1. Running setTimeout in READY file.`);
    checkReady(payload, shard);
  }, 2000);
}

/** This function checks if the shard is fully loaded */
function checkReady(payload: Ready, shard: DiscordenoShard) {
  // Check if all guilds were loaded
  if (!shard.unavailableGuildIds.size) return loaded(shard);

  // If the last GUILD_CREATE has been received before 5 seconds if so most likely the remaining guilds are unavailable
  if (shard.lastAvailable + 5000 < Date.now()) {
    eventHandlers.shardFailedToLoad?.(shard.id, shard.unavailableGuildIds);
    // Force execute the loaded function to prevent infinite loop
    return loaded(shard);
  }

  // Not all guilds were loaded but 5 seconds haven't passed so check again
  setTimeout(() => {
    eventHandlers.debug?.("loop", `2. Running setTimeout in READY file.`);
    checkReady(payload, shard);
  }, 2000);
}

function loaded(shard: DiscordenoShard) {
  shard.ready = true;

  // If it is not the last shard we can't go full ready
  if (shard.id !== ws.lastShardId) return;

  // Still some shards are loading so wait another 2 seconds for them
  if (ws.shards.some((shard) => !shard.ready)) {
    setTimeout(() => {
      eventHandlers.debug?.("loop", `3. Running setTimeout in READY file.`);
      loaded(shard);
    }, 2000);

    return;
  }

  cache.isReady = true;
  eventHandlers.ready?.();
}
