// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/unban_member.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Remove the ban for a user. Requires BAN_MEMBERS permission */
export async function unban(guildId: bigint, id: bigint) {
  await requireBotGuildPermissions(guildId, ["BAN_MEMBERS"]);

  return await rest.runMethod<undefined>("delete", endpoints.GUILD_BAN(guildId, id));
}

// aliases
export { unban as unbanMember };
