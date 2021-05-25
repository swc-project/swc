// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/delete_channel.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { ChannelTypes } from "../../types/channels/channel_types.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Delete a channel in your server. Bot needs MANAGE_CHANNEL permissions in the server. */
export async function deleteChannel(channelId: bigint, reason?: string) {
  const channel = await cacheHandlers.get("channels", channelId);

  if (channel?.guildId) {
    const guild = await cacheHandlers.get("guilds", channel.guildId);
    if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);

    // TODO(threads): check if this requires guild perms or channel is enough
    await requireBotGuildPermissions(
      guild,
      [ChannelTypes.GuildNewsThread, ChannelTypes.GuildPivateThread, ChannelTypes.GuildPublicThread].includes(
        channel.type
      )
        ? ["MANAGE_THREADS"]
        : ["MANAGE_CHANNELS"]
    );
    if (guild.rulesChannelId === channelId) {
      throw new Error(Errors.RULES_CHANNEL_CANNOT_BE_DELETED);
    }

    if (guild.publicUpdatesChannelId === channelId) {
      throw new Error(Errors.UPDATES_CHANNEL_CANNOT_BE_DELETED);
    }
  }

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_BASE(channelId), { reason });
}
