// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_delete_bulk.ts


/** https://discord.com/developers/docs/topics/gateway#message-delete-bulk */
export interface MessageDeleteBulk {
  /** The ids of the messages */
  ids: string[];
  /** The id of the channel */
  channelId: string;
  /** The id of the guild */
  guildId?: string;
}
