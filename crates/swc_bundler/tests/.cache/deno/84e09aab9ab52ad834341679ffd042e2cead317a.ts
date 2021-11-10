// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/CHANNEL_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { Channel } from "../../types/channels/channel.ts";
import { DiscordChannelTypes } from "../../types/channels/channel_types.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleChannelDelete(data: DiscordGatewayPayload) {
  const payload = data.d as Channel;

  const cachedChannel = await cacheHandlers.get("channels", snowflakeToBigint(payload.id));
  if (!cachedChannel) return;

  if (cachedChannel.type === DiscordChannelTypes.GuildVoice && payload.guildId) {
    const guild = await cacheHandlers.get("guilds", cachedChannel.guildId);

    if (guild) {
      return Promise.all(
        guild.voiceStates.map(async (vs, key) => {
          if (vs.channelId !== cachedChannel.id) return;

          // Since this channel was deleted all voice states for this channel should be deleted
          guild.voiceStates.delete(key);

          const member = await cacheHandlers.get("members", vs.userId);
          if (!member) return;

          eventHandlers.voiceChannelLeave?.(member, vs.channelId);
        })
      );
    }
  }

  if (
    [
      DiscordChannelTypes.GuildText,
      DiscordChannelTypes.DM,
      DiscordChannelTypes.GroupDm,
      DiscordChannelTypes.GuildNews,
    ].includes(payload.type)
  ) {
    await cacheHandlers.delete("channels", snowflakeToBigint(payload.id));
    cacheHandlers.forEach("messages", (message) => {
      eventHandlers.debug?.("loop", `Running forEach messages loop in CHANNEL_DELTE file.`);
      if (message.channelId === snowflakeToBigint(payload.id)) {
        cacheHandlers.delete("messages", message.id);
      }
    });
  }

  await cacheHandlers.delete("channels", snowflakeToBigint(payload.id));

  eventHandlers.channelDelete?.(cachedChannel);
}
