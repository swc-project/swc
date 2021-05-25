// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/delete_guild.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";

/** Delete a guild permanently. User must be owner. Returns 204 No Content on success. Fires a Guild Delete Gateway event. */
export async function deleteGuild(guildId: bigint) {
  return await rest.runMethod<undefined>("delete", endpoints.GUILDS_BASE(guildId));
}
