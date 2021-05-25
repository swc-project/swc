// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/welcome_screen_channel.ts


/** https://discord.com/developers/docs/resources/guild#welcome-screen-object-welcome-screen-channel-structure */
export interface WelcomeScreenChannel {
  /** The channel's id */
  channelId: string;
  /** The descriptino schown for the channel */
  description: string;
  /** The emoji id, if the emoji is custom */
  emojiId: string | null;
  /** The emoji name if custom, the unicode character if standard, or `null` if no emoji is set */
  emojiName: string | null;
}
