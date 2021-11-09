// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/CHANNEL_CREATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";

export async function handleChannelCreate(data: DiscordGatewayPayload) {
  const payload = data.d as Channel;

  const discordenoChannel = await structures.createDiscordenoChannel(payload);
  await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

  eventHandlers.channelCreate?.(discordenoChannel);
}
