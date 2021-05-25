// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_welcome_screen.ts


import { rest } from "../../rest/rest.ts";
import type { WelcomeScreen } from "../../types/guilds/welcome_screen.ts";
import { endpoints } from "../../util/constants.ts";

export async function getWelcomeScreen(guildId: bigint) {
  return await rest.runMethod<WelcomeScreen>("get", endpoints.GUILD_WELCOME_SCREEN(guildId));
}
