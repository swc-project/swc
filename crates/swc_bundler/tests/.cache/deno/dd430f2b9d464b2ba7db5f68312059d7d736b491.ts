// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/edit_guild.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Guild } from "../../types/guilds/guild.ts";
import type { ModifyGuild } from "../../types/guilds/modify_guild.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { urlToBase64 } from "../../util/utils.ts";
import { ws } from "../../ws/ws.ts";

/** Modify a guilds settings. Requires the MANAGE_GUILD permission. */
export async function editGuild(guildId: bigint, options: ModifyGuild) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  if (options.icon && !options.icon.startsWith("data:image/")) {
    options.icon = await urlToBase64(options.icon);
  }

  if (options.banner && !options.banner.startsWith("data:image/")) {
    options.banner = await urlToBase64(options.banner);
  }

  if (options.splash && !options.splash.startsWith("data:image/")) {
    options.splash = await urlToBase64(options.splash);
  }

  const result = await rest.runMethod<Guild>("patch", endpoints.GUILDS_BASE(guildId), options);

  const cached = await cacheHandlers.get("guilds", guildId);
  return structures.createDiscordenoGuild(
    result,
    cached?.shardId || Number((BigInt(result.id) >> 22n % BigInt(ws.botGatewayData.shards)).toString())
  );
}
