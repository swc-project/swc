// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/misc/typing_start.ts


import { GuildMember } from "../members/guild_member.ts";

/** https://discord.com/developers/docs/topics/gateway#typing-start */
export interface TypingStart {
  /** id of the channel */
  channelId: string;
  /** id of the guild */
  guildId?: string;
  /** id of the user */
  userId: string;
  /** Unix time (in seconds) of when the user started typing */
  timestamp: number;
  /** The member who started typing if this happened in a guild */
  member?: GuildMember;
}
