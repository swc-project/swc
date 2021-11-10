// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/roles/add_role.ts


import { botId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { isHigherPosition, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Add a role to the member */
export async function addRole(guildId: bigint, memberId: bigint, roleId: bigint, reason?: string) {
  const isHigherRolePosition = await isHigherPosition(guildId, botId, roleId);
  if (!isHigherRolePosition) {
    throw new Error(Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
  }

  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  return await rest.runMethod<undefined>("put", endpoints.GUILD_MEMBER_ROLE(guildId, memberId, roleId), { reason });
}
