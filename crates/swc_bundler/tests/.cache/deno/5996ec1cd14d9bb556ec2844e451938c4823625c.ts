// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/delete_guild_template.ts


import { rest } from "../../rest/rest.ts";
import type { Template } from "../../types/templates/template.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/**
 * Deletes a template from a guild.
 * Requires the `MANAGE_GUILD` permission.
 */
export async function deleteGuildTemplate(guildId: bigint, templateCode: string) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<Template>("delete", `${endpoints.GUILD_TEMPLATES(guildId)}/${templateCode}`);
}
