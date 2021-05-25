// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/create_guild_from_template.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Guild } from "../../types/guilds/guild.ts";
import type { CreateGuildFromTemplate } from "../../types/templates/create_guild_from_template.ts";
import { endpoints } from "../../util/constants.ts";
import { urlToBase64 } from "../../util/utils.ts";
import { ws } from "../../ws/ws.ts";

/**
 * Create a new guild based on a template
 * NOTE: This endpoint can be used only by bots in less than 10 guilds.
 */
export async function createGuildFromTemplate(templateCode: string, data: CreateGuildFromTemplate) {
  if ((await cacheHandlers.size("guilds")) >= 10) {
    throw new Error("This function can only be used by bots in less than 10 guilds.");
  }

  if (data.icon) {
    data.icon = await urlToBase64(data.icon);
  }

  const createdGuild = await rest.runMethod<Guild>("post", endpoints.GUILD_TEMPLATE(templateCode), data);

  return await structures.createDiscordenoGuild(
    createdGuild,
    Number((BigInt(createdGuild.id) >> 22n % BigInt(ws.botGatewayData.shards)).toString())
  );
}
