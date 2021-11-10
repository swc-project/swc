// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/CHANNEL_PINS_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { ChannelPinsUpdate } from "../../types/channels/channel_pins_update.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleChannelPinsUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as ChannelPinsUpdate;

  const channel = await cacheHandlers.get("channels", snowflakeToBigint(payload.channelId));
  if (!channel) return;

  const guild = payload.guildId ? await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId)) : undefined;

  eventHandlers.channelPinsUpdate?.(channel, guild, payload.lastPinTimestamp);
}
