// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/CHANNEL_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleChannelUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as Channel;
  const cachedChannel = await cacheHandlers.get("channels", snowflakeToBigint(payload.id));
  if (!cachedChannel) return;

  const discordenoChannel = await structures.createDiscordenoChannel(payload);
  await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

  eventHandlers.channelUpdate?.(discordenoChannel, cachedChannel);
}
