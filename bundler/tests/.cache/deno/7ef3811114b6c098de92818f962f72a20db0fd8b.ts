// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/modify_guild_welcome_screen.ts


import { WelcomeScreenChannel } from "./welcome_screen_channel.ts";

/** https://discord.com/developers/docs/resources/guild#modify-guild-welcome-screen */
export interface ModifyGuildWelcomeScreen {
  /** Whether the welcome screen is enabled */
  enabled?: boolean | null;
  /** Channels linked in the welcome screen and their display options */
  welcomeScreen?: WelcomeScreenChannel[] | null;
  /** The server description to show in the welcome screen */
  description?: string | null;
}
