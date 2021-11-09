// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/leave_guild.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";

/** Leave a guild */
export async function leaveGuild(guildId: bigint) {
  return await rest.runMethod<undefined>("delete", endpoints.GUILD_LEAVE(guildId));
}
