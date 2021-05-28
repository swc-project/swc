// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/get_channel.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { endpoints } from "../../util/constants.ts";

/** Fetches a single channel object from the api.
 *
 * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your channels will be cached in your guild.**
 */
export async function getChannel(channelId: bigint, addToCache = true) {
  const result = await rest.runMethod<Channel>("get", endpoints.CHANNEL_BASE(channelId));

  const discordenoChannel = await structures.createDiscordenoChannel(
    result,
    result.guildId ? snowflakeToBigint(result.guildId) : undefined
  );
  if (addToCache) {
    await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);
  }

  return discordenoChannel;
}
