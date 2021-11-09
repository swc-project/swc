// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/THREAD_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import { Channel } from "../../types/channels/channel.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleThreadUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as Channel;
  const oldChannel = await cacheHandlers.get("channels", snowflakeToBigint(payload.id));
  if (!oldChannel) return;

  const discordenoChannel = await structures.createDiscordenoChannel(payload);
  await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

  eventHandlers.threadUpdate?.(discordenoChannel, oldChannel);
}
