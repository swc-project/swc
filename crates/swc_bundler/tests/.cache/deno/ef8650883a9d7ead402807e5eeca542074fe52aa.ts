// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/create_channel.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import { DiscordChannelTypes } from "../../types/channels/channel_types.ts";
import type { CreateGuildChannel, DiscordCreateGuildChannel } from "../../types/guilds/create_guild_channel.ts";
import { endpoints } from "../../util/constants.ts";
import { calculateBits, requireOverwritePermissions } from "../../util/permissions.ts";
import { snakelize } from "../../util/utils.ts";

/** Create a channel in your server. Bot needs MANAGE_CHANNEL permissions in the server. */
export async function createChannel(guildId: bigint, options?: CreateGuildChannel, reason?: string) {
  if (options?.permissionOverwrites) {
    await requireOverwritePermissions(guildId, options.permissionOverwrites);
  }

  // BITRATES ARE IN THOUSANDS SO IF USER PROVIDES 32 WE CONVERT TO 32000
  if (options?.bitrate && options.bitrate < 1000) options.bitrate *= 1000;

  const result = await rest.runMethod<Channel>("post", endpoints.GUILD_CHANNELS(guildId), {
    ...snakelize<DiscordCreateGuildChannel>(options ?? {}),
    permission_overwrites: options?.permissionOverwrites?.map((perm) => ({
      ...perm,
      allow: calculateBits(perm.allow),
      deny: calculateBits(perm.deny),
    })),
    type: options?.type || DiscordChannelTypes.GuildText,
    reason,
  });

  const discordenoChannel = await structures.createDiscordenoChannel(result);
  await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

  return discordenoChannel;
}
