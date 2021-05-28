// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/clone_channel.ts


import { cacheHandlers } from "../../cache.ts";
import { DiscordChannelTypes } from "../../types/channels/channel_types.ts";
import type { CreateGuildChannel } from "../../types/guilds/create_guild_channel.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { calculatePermissions } from "../../util/permissions.ts";
import { helpers } from "../mod.ts";

/** Create a copy of a channel */
export async function cloneChannel(channelId: bigint, reason?: string) {
  const channelToClone = await cacheHandlers.get("channels", channelId);
  if (!channelToClone) throw new Error(Errors.CHANNEL_NOT_FOUND);

  //Check for DM channel
  if (channelToClone.type === DiscordChannelTypes.DM || channelToClone.type === DiscordChannelTypes.GroupDm) {
    throw new Error(Errors.CHANNEL_NOT_IN_GUILD);
  }

  const createChannelOptions: CreateGuildChannel = {
    ...channelToClone,
    name: channelToClone.name!,
    topic: channelToClone.topic || undefined,
    permissionOverwrites: channelToClone.permissionOverwrites.map((overwrite) => ({
      id: overwrite.id.toString(),
      type: overwrite.type,
      allow: calculatePermissions(overwrite.allow.toString()),
      deny: calculatePermissions(overwrite.deny.toString()),
    })),
  };

  //Create the channel (also handles permissions)
  return await helpers.createChannel(channelToClone.guildId!, createChannelOptions, reason);
}
