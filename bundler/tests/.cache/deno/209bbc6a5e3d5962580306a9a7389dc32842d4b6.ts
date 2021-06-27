// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/emojis/guild_emojis_update.ts


import { Emoji } from "../emojis/emoji.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-emojis-update */
export interface GuildEmojisUpdate {
  /** id of the guild */
  guildId: string;
  /** Array of emojis */
  emojis: Emoji[];
}
