// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/is_channel_synced.ts


import { cacheHandlers } from "../../cache.ts";

/** Checks whether a channel is synchronized with its parent/category channel or not. */
export async function isChannelSynced(channelId: bigint) {
  const channel = await cacheHandlers.get("channels", channelId);
  if (!channel?.parentId) return false;

  const parentChannel = await cacheHandlers.get("channels", channel.parentId);
  if (!parentChannel) return false;

  return channel.permissionOverwrites?.every((overwrite) => {
    const permission = parentChannel.permissionOverwrites?.find((ow) => ow.id === overwrite.id);
    if (!permission) return false;
    return !(overwrite.allow !== permission.allow || overwrite.deny !== permission.deny);
  });
}
