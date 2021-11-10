// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_flags.ts


/** https://discord.com/developers/docs/resources/channel#message-object-message-flags */
export enum DiscordMessageFlags {
  /** This message has been published to subscribed channels (via Channel Following) */
  Crossposted = 1 << 0,
  /** This message originated from a message in another channel (via Channel Following) */
  IsCrosspost = 1 << 1,
  /** Do not include any embeds when serializing this message */
  SuppressEmbeeds = 1 << 2,
  /** The source message for this crosspost has been deleted (via Channel Following) */
  SourceMessageDeleted = 1 << 3,
  /** This message came from the urgent message system */
  Urgent = 1 << 4,
  /** This message has an associated thread, with the same id as the message */
  HasThread = 1 << 5,
  /** This message is only visible to the user who invoked the Interaction */
  Empheral = 1 << 6,
  /** This message is an Interaction Response and the bot is "thinking" */
  Loading = 1 << 7,
}

export type MessageFlags = DiscordMessageFlags;
export const MessageFlags = DiscordMessageFlags;
