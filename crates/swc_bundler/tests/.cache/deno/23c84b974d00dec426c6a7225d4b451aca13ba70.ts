// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/gateway_intents.ts


/** https://discord.com/developers/docs/topics/gateway#list-of-intents */
export enum DiscordGatewayIntents {
  /**
   * - GUILD_CREATE
   * - GUILD_DELETE
   * - GUILD_ROLE_CREATE
   * - GUILD_ROLE_UPDATE
   * - GUILD_ROLE_DELETE
   * - CHANNEL_CREATE
   * - CHANNEL_UPDATE
   * - CHANNEL_DELETE
   * - CHANNEL_PINS_UPDATE
   * - THREAD_CREATE
   * - THREAD_UPDATE
   * - THREAD_DELETE
   * - THREAD_LIST_SYNC
   * - THREAD_MEMBER_UPDATE
   * - THREAD_MEMBERS_UPDATE
   * - STAGE_INSTANCE_CREATE
   * - STAGE_INSTANCE_UPDATE
   * - STAGE_INSTANCE_DELETE
   */
  Guilds = 1 << 0,
  /**
   * - GUILD_MEMBER_ADD
   * - GUILD_MEMBER_UPDATE
   * - GUILD_MEMBER_REMOVE
   */
  GuildMembers = 1 << 1,
  /**
   * - GUILD_BAN_ADD
   * - GUILD_BAN_REMOVE
   */
  GuildBans = 1 << 2,
  /**
   * - GUILD_EMOJIS_UPDATE
   */
  GuildEmojis = 1 << 3,
  /**
   * - GUILD_INTEGRATIONS_UPDATE
   * - INTEGRATION_CREATE
   * - INTEGRATION_UPDATE
   * - INTEGRATION_DELETE
   */
  GuildIntegrations = 1 << 4,
  /** Enables the following events:
   * - WEBHOOKS_UPDATE
   */
  GuildWebhooks = 1 << 5,
  /**
   * - INVITE_CREATE
   * - INVITE_DELETE
   */
  GuildInvites = 1 << 6,
  /**
   * - VOICE_STATE_UPDATE
   */
  GuildVoiceStates = 1 << 7,
  /**
   * - PRESENCE_UPDATE
   */
  GuildPresences = 1 << 8,
  /**
   * - MESSAGE_CREATE
   * - MESSAGE_UPDATE
   * - MESSAGE_DELETE
   */
  GuildMessages = 1 << 9,
  /**
   * - MESSAGE_REACTION_ADD
   * - MESSAGE_REACTION_REMOVE
   * - MESSAGE_REACTION_REMOVE_ALL
   * - MESSAGE_REACTION_REMOVE_EMOJI
   */
  GuildMessageReactions = 1 << 10,
  /**
   * - TYPING_START
   */
  GuildMessageTyping = 1 << 11,
  /**
   * - CHANNEL_CREATE
   * - MESSAGE_CREATE
   * - MESSAGE_UPDATE
   * - MESSAGE_DELETE
   * - CHANNEL_PINS_UPDATE
   */
  DirectMessages = 1 << 12,
  /**
   * - MESSAGE_REACTION_ADD
   * - MESSAGE_REACTION_REMOVE
   * - MESSAGE_REACTION_REMOVE_ALL
   * - MESSAGE_REACTION_REMOVE_EMOJI
   */
  DirectMessageReactions = 1 << 13,
  /**
   * - TYPING_START
   */
  DirectMessageTyping = 1 << 14,
}

export type Intents = DiscordGatewayIntents;
export const Intents = DiscordGatewayIntents;
