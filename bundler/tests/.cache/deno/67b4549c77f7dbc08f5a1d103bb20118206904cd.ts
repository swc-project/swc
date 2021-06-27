// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/create_guild_template.ts


import { rest } from "../../rest/rest.ts";
import type { Template } from "../../types/templates/template.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/**
 * Creates a template for the guild.
 * Requires the `MANAGE_GUILD` permission.
 * @param name name of the template (1-100 characters)
 * @param description description for the template (0-120 characters
 */
export async function createGuildTemplate(guildId: bigint, data: Template) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  if (data.name.length < 1 || data.name.length > 100) {
    throw new Error("The name can only be in between 1-100 characters.");
  }

  if (data.description?.length && data.description.length > 120) {
    throw new Error("The description can only be in between 0-120 characters.");
  }

  return await rest.runMethod<Template>("post", endpoints.GUILD_TEMPLATES(guildId), data);
}
