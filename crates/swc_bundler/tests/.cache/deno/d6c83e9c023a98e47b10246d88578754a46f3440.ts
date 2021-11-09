// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_guild.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Guild } from "../../types/guilds/guild.ts";
import { endpoints } from "../../util/constants.ts";
import { ws } from "../../ws/ws.ts";

/**
 * ⚠️ **If you need this, you are probably doing something wrong. Always use cache.guilds.get()
 *
 * Advanced Devs:
 * This function fetches a guild's data. This is not the same data as a GUILD_CREATE.
 * So it does not cache the guild, you must do it manually.
 * */
export async function getGuild(
  guildId: bigint,
  options: { counts?: boolean; addToCache?: boolean } = {
    counts: true,
    addToCache: true,
  }
) {
  const result = await rest.runMethod<Guild>("get", endpoints.GUILDS_BASE(guildId), {
    with_counts: options.counts,
  });

  const guild = await structures.createDiscordenoGuild(
    result,
    Number((BigInt(guildId) >> 22n) % BigInt(ws.botGatewayData.shards))
  );

  if (options.addToCache) {
    await cacheHandlers.set("guilds", guild.id, guild);
  }

  return guild;
}
