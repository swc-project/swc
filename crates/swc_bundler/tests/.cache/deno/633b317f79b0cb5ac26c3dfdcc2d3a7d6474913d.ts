// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/templates/get_template.ts


import { rest } from "../../rest/rest.ts";
import type { Template } from "../../types/templates/template.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the guild template if it exists */
export async function getTemplate(templateCode: string) {
  return await rest.runMethod<Template>("get", endpoints.GUILD_TEMPLATE(templateCode));
}
