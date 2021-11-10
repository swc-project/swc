// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_ban.ts


import { rest } from "../../rest/rest.ts";
import type { Ban } from "../../types/guilds/ban.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Returns a ban object for the given user or a 404 not found if the ban cannot be found. Requires the BAN_MEMBERS permission. */
export async function getBan(guildId: bigint, memberId: bigint) {
  await requireBotGuildPermissions(guildId, ["BAN_MEMBERS"]);

  return await rest.runMethod<Ban>("get", endpoints.GUILD_BAN(guildId, memberId));
}
