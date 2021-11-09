// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_reaction_add.ts


import { Emoji } from "../emojis/emoji.ts";
import { GuildMemberWithUser } from "../members/guild_member.ts";

/** https://discord.com/developers/docs/topics/gateway#message-reaction-add */
export interface MessageReactionAdd {
  /** The id of the user */
  userId: string;
  /** The id of the channel */
  channelId: string;
  /** The id of the message */
  messageId: string;
  /** The id of the guild */
  guildId?: string;
  /** The member who reacted if this happened in a guild */
  member?: GuildMemberWithUser;
  /** The emoji used to react */
  emoji: Partial<Emoji>;
}
