// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/emojis/get_emoji.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import type { Emoji } from "../../types/emojis/emoji.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";

/**
 * Returns an emoji for the given guild and emoji Id.
 *
 * ⚠️ **If you need this, you are probably doing something wrong. Always use cache.guilds.get()?.emojis
 */
export async function getEmoji(guildId: bigint, emojiId: bigint, addToCache = true) {
  const result = await rest.runMethod<Emoji>("get", endpoints.GUILD_EMOJI(guildId, emojiId));

  if (addToCache) {
    const guild = await cacheHandlers.get("guilds", guildId);
    if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);
    guild.emojis.set(emojiId, result);
    await cacheHandlers.set("guilds", guildId, guild);
  }

  return result;
}
