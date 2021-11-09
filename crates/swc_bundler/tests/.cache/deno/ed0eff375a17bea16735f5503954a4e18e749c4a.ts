// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/kick_member.ts


import { botId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { highestRole, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Kick a member from the server */
export async function kick(guildId: bigint, memberId: bigint, reason?: string) {
  const botsHighestRole = await highestRole(guildId, botId);
  const membersHighestRole = await highestRole(guildId, memberId);
  if (botsHighestRole && membersHighestRole && botsHighestRole.position <= membersHighestRole.position) {
    throw new Error(Errors.BOTS_HIGHEST_ROLE_TOO_LOW);
  }

  await requireBotGuildPermissions(guildId, ["KICK_MEMBERS"]);

  return await rest.runMethod<undefined>("delete", endpoints.GUILD_MEMBER(guildId, memberId), { reason });
}

// aliases
export { kick as kickMember };
