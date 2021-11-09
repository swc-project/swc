// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_activity_types.ts


/** https://discord.com/developers/docs/resources/channel#message-object-message-activity-types */
export enum DiscordMessageActivityTypes {
  Join = 1,
  Spectate,
  Listen,
  JoinRequest,
}

export type MessageActivityTypes = DiscordMessageActivityTypes;
export const MessageActivityTypes = DiscordMessageActivityTypes;
