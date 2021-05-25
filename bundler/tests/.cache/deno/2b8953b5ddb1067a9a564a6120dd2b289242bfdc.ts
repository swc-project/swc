// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/edit_guild_template.ts


import { rest } from "../../rest/rest.ts";
import type { ModifyGuildTemplate } from "../../types/templates/modify_guild_template.ts";
import type { Template } from "../../types/templates/template.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/**
 * Edit a template's metadata.
 * Requires the `MANAGE_GUILD` permission.
 */
export async function editGuildTemplate(guildId: bigint, templateCode: string, data: ModifyGuildTemplate) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  if (data.name?.length && (data.name.length < 1 || data.name.length > 100)) {
    throw new Error("The name can only be in between 1-100 characters.");
  }

  if (data.description?.length && data.description.length > 120) {
    throw new Error("The description can only be in between 0-120 characters.");
  }

  return await rest.runMethod<Template>("patch", `${endpoints.GUILD_TEMPLATES(guildId)}/${templateCode}`, data);
}
