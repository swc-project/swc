// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_reference.ts


/** https://discord.com/developers/docs/resources/channel#message-object-message-reference-structure */
export interface MessageReference {
  /** id of the originating message */
  messageId?: string;
  /**
   * id of the originating message's channel
   * Note: `channel_id` is optional when creating a reply, but will always be present when receiving an event/response that includes this data model.
   */
  channelId?: string;
  /** id of the originating message's guild */
  guildId?: string;
  /** When sending, whether to error if the referenced message doesn't exist instead of sending as a normal (non-reply) message, default true */
  failIfNotExists: boolean;
}
