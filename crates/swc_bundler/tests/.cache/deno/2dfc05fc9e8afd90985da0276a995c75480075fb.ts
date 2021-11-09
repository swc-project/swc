// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/integrations/delete_integration.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Delete the attached integration object for the guild with this id. Requires MANAGE_GUILD permission. */
export async function deleteIntegration(guildId: bigint, id: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<undefined>("delete", endpoints.GUILD_INTEGRATION(guildId, id));
}
