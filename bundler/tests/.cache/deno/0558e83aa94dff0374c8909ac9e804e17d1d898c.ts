// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_types.ts


/** https://discord.com/developers/docs/resources/channel#message-object-message-types */
export enum DiscordMessageTypes {
  Default,
  RecipientAdd,
  RecipientRemove,
  Call,
  ChannelNameChange,
  ChannelIconChange,
  ChannelPinnedMessage,
  GuildMemberJoin,
  UserPremiumGuildSubscription,
  UserPremiumGuildSubscriptionTier1,
  UserPremiumGuildSubscriptionTier2,
  UserPremiumGuildSubscriptionTier3,
  ChannelFollowAdd,
  GuildDiscoveryDisqualified = 14,
  GuildDiscoveryRequalified,
  GuildDiscoveryGracePeriodInitialWarning,
  GuildDiscoveryGracePeriodFinalWarning,
  ThreadCreated,
  Reply = 19,
  ApplicationCommand,
  GuildInviteReminder = 22,
}

export type MessageTypes = DiscordMessageTypes;
export const MessageTypes = DiscordMessageTypes;
