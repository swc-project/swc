// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/get_guild_templates.ts


import { rest } from "../../rest/rest.ts";
import type { Template } from "../../types/templates/template.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/**
 * Returns an array of templates.
 * Requires the `MANAGE_GUILD` permission.
 */
export async function getGuildTemplates(guildId: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  const templates = await rest.runMethod<Template[]>("get", endpoints.GUILD_TEMPLATES(guildId));

  return new Collection(templates.map((template) => [template.code, template]));
}
