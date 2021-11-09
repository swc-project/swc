// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/edit_welcome_screen.ts


import { rest } from "../../rest/rest.ts";
import type { ModifyGuildWelcomeScreen } from "../../types/guilds/modify_guild_welcome_screen.ts";
import type { WelcomeScreen } from "../../types/guilds/welcome_screen.ts";
import { endpoints } from "../../util/constants.ts";
import { snakelize } from "../../util/utils.ts";

export async function editWelcomeScreen(guildId: bigint, options: ModifyGuildWelcomeScreen) {
  return await rest.runMethod<WelcomeScreen>("patch", endpoints.GUILD_WELCOME_SCREEN(guildId), snakelize(options));
}
