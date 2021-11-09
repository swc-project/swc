// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/heartbeat.ts


import { DiscordGatewayOpcodes } from "../types/codes/gateway_opcodes.ts";
import { delay } from "../util/utils.ts";
import { identify } from "./identify.ts";
import { ws } from "./ws.ts";

export async function heartbeat(shardId: number, interval: number) {
  ws.log("HEARTBEATING_STARTED", { shardId, interval });

  const shard = ws.shards.get(shardId);
  if (!shard) return;

  ws.log("HEARTBEATING_DETAILS", { shardId, interval, shard });

  // The first heartbeat is special so we send it without setInterval: https://discord.com/developers/docs/topics/gateway#heartbeating
  await delay(Math.floor(shard.heartbeat.interval * Math.random()));

  if (shard.ws.readyState !== WebSocket.OPEN) return;

  shard.ws.send(
    JSON.stringify({
      op: DiscordGatewayOpcodes.Heartbeat,
      d: shard.previousSequenceNumber,
    })
  );

  shard.heartbeat.keepAlive = true;
  shard.heartbeat.acknowledged = false;
  shard.heartbeat.lastSentAt = Date.now();
  shard.heartbeat.interval = interval;

  shard.heartbeat.intervalId = setInterval(() => {
    ws.log("DEBUG", `Running setInterval in heartbeat file.`);
    const currentShard = ws.shards.get(shardId);
    if (!currentShard) return;

    ws.log("HEARTBEATING", { shardId, shard: currentShard });

    if (currentShard.ws.readyState === WebSocket.CLOSED || !currentShard.heartbeat.keepAlive) {
      ws.log("HEARTBEATING_CLOSED", { shardId, shard: currentShard });

      // STOP THE HEARTBEAT
      return clearInterval(shard.heartbeat.intervalId);
    }

    if (!currentShard.heartbeat.acknowledged) {
      ws.closeWS(currentShard.ws, 3066, "Did not receive an ACK in time.");
      return identify(shardId, ws.maxShards);
    }

    if (currentShard.ws.readyState !== WebSocket.OPEN) return;

    currentShard.heartbeat.acknowledged = false;

    currentShard.ws.send(
      JSON.stringify({
        op: DiscordGatewayOpcodes.Heartbeat,
        d: currentShard.previousSequenceNumber,
      })
    );
  }, shard.heartbeat.interval);
}
