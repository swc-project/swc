// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_guild_preview.ts


import { rest } from "../../rest/rest.ts";
import type { GuildPreview } from "../../types/guilds/guild_preview.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the guild preview object for the given id. If the bot is not in the guild, then the guild must be Discoverable. */
export async function getGuildPreview(guildId: bigint) {
  return await rest.runMethod<GuildPreview>("get", endpoints.GUILD_PREVIEW(guildId));
}
