// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/get_channels.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns a list of guild channel objects.
 *
 * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your channels will be cached in your guild.**
 */
export async function getChannels(guildId: bigint, addToCache = true) {
  const result = await rest.runMethod<Channel[]>("get", endpoints.GUILD_CHANNELS(guildId));

  return new Collection(
    (
      await Promise.all(
        result.map(async (res) => {
          const discordenoChannel = await structures.createDiscordenoChannel(res, guildId);
          if (addToCache) {
            await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);
          }

          return discordenoChannel;
        })
      )
    ).map((c) => [c.id, c])
  );
}
