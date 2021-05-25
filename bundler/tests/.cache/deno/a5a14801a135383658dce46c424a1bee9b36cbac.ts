// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/welcome_screen.ts


import { WelcomeScreenChannel } from "./welcome_screen_channel.ts";

/** https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-structure */
export interface WelcomeScreen {
  /** The server description shown in the welcome screen */
  description: string | null;
  /** The channels shown in the welcome screen, up to 5 */
  welcomeChannels: WelcomeScreenChannel[];
}
