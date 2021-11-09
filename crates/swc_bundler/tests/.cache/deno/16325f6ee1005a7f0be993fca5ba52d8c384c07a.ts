// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/roles/delete_role.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Delete a guild role. Requires the MANAGE_ROLES permission. */
export async function deleteRole(guildId: bigint, id: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  return await rest.runMethod<undefined>("delete", endpoints.GUILD_ROLE(guildId, id));
}
