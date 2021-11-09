// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/discovery/add_discovery_subcategory.ts


import { rest } from "../../rest/rest.ts";
import type { AddGuildDiscoverySubcategory } from "../../types/discovery/add_guild_discovery_subcategory.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Add a discovery subcategory to the guild. Requires the `MANAGE_GUILD` permission. */
export async function addDiscoverySubcategory(guildId: bigint, categoryId: number) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<AddGuildDiscoverySubcategory>(
    "post",
    endpoints.DISCOVERY_SUBCATEGORY(guildId, categoryId)
  );
}
