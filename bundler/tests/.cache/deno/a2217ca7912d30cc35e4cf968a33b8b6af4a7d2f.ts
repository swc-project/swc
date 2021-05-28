// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_delete.ts


/** https://discord.com/developers/docs/topics/gateway#message-delete */
export interface MessageDelete {
  /** The id of the message */
  id: string;
  /** The id of the channel */
  channelId: string;
  /** The id of the guild */
  guildId?: string;
}
