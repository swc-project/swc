// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/constants.ts


/** https://discord.com/developers/docs/reference#api-reference-base-url */
export const BASE_URL = "https://discord.com/api";

/** https://discord.com/developers/docs/reference#api-versioning-api-versions */
export const API_VERSION = 9;

/** https://discord.com/developers/docs/topics/gateway#gateways-gateway-versions */
export const GATEWAY_VERSION = 9;

// TODO: update this version
/** https://github.com/discordeno/discordeno/releases */
export const DISCORDENO_VERSION = "11.0.0-rc.2";

/** https://discord.com/developers/docs/reference#user-agent */
export const USER_AGENT = `DiscordBot (https://github.com/discordeno/discordeno, v${DISCORDENO_VERSION})`;

/** https://discord.com/developers/docs/reference#image-formatting-image-base-url */
export const IMAGE_BASE_URL = "https://cdn.discordapp.com";

// This can be modified by big brain bots and use a proxy
export const baseEndpoints = {
  BASE_URL: `${BASE_URL}/v${API_VERSION}`,
  CDN_URL: IMAGE_BASE_URL,
};

const GUILDS_BASE = (guildId: bigint) => `${baseEndpoints.BASE_URL}/guilds/${guildId}`;
const CHANNEL_BASE = (channelId: bigint) => `${baseEndpoints.BASE_URL}/channels/${channelId}`;

export const endpoints = {
  GUILDS_BASE,
  CHANNEL_BASE,

  GATEWAY_BOT: `${baseEndpoints.BASE_URL}/gateway/bot`,

  // Channel Endpoints
  CHANNEL_MESSAGE: (channelId: bigint, messageId: bigint) => `${CHANNEL_BASE(channelId)}/messages/${messageId}`,
  CHANNEL_MESSAGES: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/messages`,
  CHANNEL_PIN: (channelId: bigint, messageId: bigint) => `${CHANNEL_BASE(channelId)}/pins/${messageId}`,
  CHANNEL_PINS: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/pins`,
  CHANNEL_BULK_DELETE: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/messages/bulk-delete`,
  CHANNEL_INVITES: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/invites`,
  CHANNEL_WEBHOOKS: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/webhooks`,
  CHANNEL_MESSAGE_REACTION_ME: (channelId: bigint, messageId: bigint, emoji: string) =>
    `${CHANNEL_BASE(channelId)}/messages/${messageId}/reactions/${emoji}/@me`,
  CHANNEL_MESSAGE_REACTION_USER: (channelId: bigint, messageId: bigint, emoji: string, userId: bigint) =>
    `${CHANNEL_BASE(channelId)}/messages/${messageId}/reactions/${emoji}/${userId}`,
  CHANNEL_MESSAGE_REACTIONS: (channelId: bigint, messageId: bigint) =>
    `${CHANNEL_BASE(channelId)}/messages/${messageId}/reactions`,
  CHANNEL_MESSAGE_REACTION: (channelId: bigint, messageId: bigint, emoji: string) =>
    `${CHANNEL_BASE(channelId)}/messages/${messageId}/reactions/${emoji}`,
  CHANNEL_FOLLOW: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/followers`,
  CHANNEL_MESSAGE_CROSSPOST: (channelId: bigint, messageId: bigint) =>
    `${CHANNEL_BASE(channelId)}/messages/${messageId}/crosspost`,
  CHANNEL_OVERWRITE: (channelId: bigint, overwriteId: bigint) =>
    `${CHANNEL_BASE(channelId)}/permissions/${overwriteId}`,
  // Bots SHALL NOT use this endpoint but they can
  CHANNEL_TYPING: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/typing`,

  // Thread Endpoints
  THREAD_START_PUBLIC: (channelId: bigint, messageId: bigint) =>
    `${endpoints.CHANNEL_MESSAGE(channelId, messageId)}/threads`,
  THREAD_START_PRIVATE: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/threads`,
  THREAD_ACTIVE: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/threads/active`,
  THREAD_MEMBERS: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/thread-members`,
  THREAD_ME: (channelId: bigint) => `${endpoints.THREAD_MEMBERS(channelId)}/@me`,
  THREAD_USER: (channelId: bigint, userId: bigint) => `${endpoints.THREAD_MEMBERS(channelId)}/${userId}`,
  THREAD_ARCHIVED_BASE: (channelId: bigint) => `${CHANNEL_BASE(channelId)}/threads/archived`,
  THREAD_ARCHIVED_PUBLIC: (channelId: bigint) => `${endpoints.THREAD_ARCHIVED_BASE(channelId)}/public`,
  THREAD_ARCHIVED_PRIVATE: (channelId: bigint) => `${endpoints.THREAD_ARCHIVED_BASE(channelId)}/private`,
  THREAD_ARCHIVED_PRIVATE_JOINED: (channelId: bigint) =>
    `${CHANNEL_BASE(channelId)}/users/@me/threads/archived/private`,

  // Guild Endpoints
  GUILDS: `${baseEndpoints.BASE_URL}/guilds`,
  GUILD_AUDIT_LOGS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/audit-logs`,
  GUILD_BAN: (guildId: bigint, userId: bigint) => `${GUILDS_BASE(guildId)}/bans/${userId}`,
  GUILD_BANS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/bans`,
  GUILD_BANNER: (guildId: bigint, icon: string) => `${baseEndpoints.CDN_URL}/banners/${guildId}/${icon}`,
  GUILD_CHANNELS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/channels`,
  GUILD_WIDGET: (guildId: bigint) => `${GUILDS_BASE(guildId)}/widget`,
  GUILD_EMOJI: (guildId: bigint, emojiId: bigint) => `${GUILDS_BASE(guildId)}/emojis/${emojiId}`,
  GUILD_EMOJIS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/emojis`,
  GUILD_ICON: (guildId: bigint, icon: string) => `${baseEndpoints.CDN_URL}/icons/${guildId}/${icon}`,
  GUILD_INTEGRATION: (guildId: bigint, integrationId: bigint) =>
    `${GUILDS_BASE(guildId)}/integrations/${integrationId}`,
  GUILD_INTEGRATION_SYNC: (guildId: bigint, integrationId: bigint) =>
    `${GUILDS_BASE(guildId)}/integrations/${integrationId}/sync`,
  GUILD_INTEGRATIONS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/integrations?include_applications=true`,
  GUILD_INVITES: (guildId: bigint) => `${GUILDS_BASE(guildId)}/invites`,
  GUILD_LEAVE: (guildId: bigint) => `${baseEndpoints.BASE_URL}/users/@me/guilds/${guildId}`,
  GUILD_MEMBER: (guildId: bigint, userId: bigint) => `${GUILDS_BASE(guildId)}/members/${userId}`,
  GUILD_MEMBERS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/members`,
  GUILD_MEMBER_ROLE: (guildId: bigint, memberId: bigint, roleId: bigint) =>
    `${GUILDS_BASE(guildId)}/members/${memberId}/roles/${roleId}`,
  GUILD_MEMBERS_SEARCH: (guildId: bigint) => `${GUILDS_BASE(guildId)}/members/search`,
  GUILD_PRUNE: (guildId: bigint) => `${GUILDS_BASE(guildId)}/prune`,
  GUILD_REGIONS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/regions`,
  GUILD_ROLE: (guildId: bigint, roleId: bigint) => `${GUILDS_BASE(guildId)}/roles/${roleId}`,
  GUILD_ROLES: (guildId: bigint) => `${GUILDS_BASE(guildId)}/roles`,
  GUILD_SPLASH: (guildId: bigint, icon: string) => `${baseEndpoints.CDN_URL}/splashes/${guildId}/${icon}`,
  GUILD_VANITY_URL: (guildId: bigint) => `${GUILDS_BASE(guildId)}/vanity-url`,
  GUILD_WEBHOOKS: (guildId: bigint) => `${GUILDS_BASE(guildId)}/webhooks`,
  GUILD_TEMPLATE: (code: string) => `${baseEndpoints.BASE_URL}/guilds/templates/${code}`,
  GUILD_TEMPLATES: (guildId: bigint) => `${GUILDS_BASE(guildId)}/templates`,
  GUILD_PREVIEW: (guildId: bigint) => `${GUILDS_BASE(guildId)}/preview`,
  UPDATE_VOICE_STATE: (guildId: bigint, userId?: bigint) => `${GUILDS_BASE(guildId)}/voice-states/${userId ?? "@me"}`,
  GUILD_WELCOME_SCREEN: (guildId: bigint) => `${GUILDS_BASE(guildId)}/welcome-screen`,

  // Voice
  VOICE_REGIONS: `${baseEndpoints.BASE_URL}/voice/regions`,

  INVITE: (inviteCode: string) => `${baseEndpoints.BASE_URL}/invites/${inviteCode}`,

  WEBHOOK: (webhookId: bigint, token: string) => `${baseEndpoints.BASE_URL}/webhooks/${webhookId}/${token}`,
  WEBHOOK_ID: (webhookId: bigint) => `${baseEndpoints.BASE_URL}/webhooks/${webhookId}`,
  WEBHOOK_MESSAGE: (webhookId: bigint, token: string, messageId: bigint) =>
    `${baseEndpoints.BASE_URL}/webhooks/${webhookId}/${token}/messages/${messageId}`,
  WEBHOOK_MESSAGE_ORIGINAL: (webhookId: bigint, token: string) =>
    `${baseEndpoints.BASE_URL}/webhooks/${webhookId}/${token}/messages/@original`,
  WEBHOOK_SLACK: (webhookId: bigint, token: string) => `${baseEndpoints.BASE_URL}/webhooks/${webhookId}/${token}/slack`,
  WEBHOOK_GITHUB: (webhookId: bigint, token: string) =>
    `${baseEndpoints.BASE_URL}/webhooks/${webhookId}/${token}/github`,

  // Application Endpoints
  COMMANDS: (applicationId: bigint) => `${baseEndpoints.BASE_URL}/applications/${applicationId}/commands`,
  COMMANDS_GUILD: (applicationId: bigint, guildId: bigint) =>
    `${baseEndpoints.BASE_URL}/applications/${applicationId}/guilds/${guildId}/commands`,
  COMMANDS_PERMISSIONS: (applicationId: bigint, guildId: bigint) =>
    `${endpoints.COMMANDS_GUILD(applicationId, guildId)}/permissions`,
  COMMANDS_PERMISSION: (applicationId: bigint, guildId: bigint, commandId: bigint) =>
    `${endpoints.COMMANDS_GUILD(applicationId, guildId)}/${commandId}/permissions`,
  COMMANDS_ID: (applicationId: bigint, commandId: bigint) =>
    `${baseEndpoints.BASE_URL}/applications/${applicationId}/commands/${commandId}`,
  COMMANDS_GUILD_ID: (applicationId: bigint, guildId: bigint, commandId: bigint) =>
    `${baseEndpoints.BASE_URL}/applications/${applicationId}/guilds/${guildId}/commands/${commandId}`,

  // Interaction Endpoints
  INTERACTION_ID_TOKEN: (interactionId: bigint, token: string) =>
    `${baseEndpoints.BASE_URL}/interactions/${interactionId}/${token}/callback`,
  INTERACTION_ORIGINAL_ID_TOKEN: (interactionId: bigint, token: string) =>
    `${baseEndpoints.BASE_URL}/webhooks/${interactionId}/${token}/messages/@original`,
  INTERACTION_ID_TOKEN_MESSAGE_ID: (applicationId: bigint, token: string, messageId: bigint) =>
    `${baseEndpoints.BASE_URL}/webhooks/${applicationId}/${token}/messages/${messageId}`,

  // User endpoints
  USER: (userId: bigint) => `${baseEndpoints.BASE_URL}/users/${userId}`,
  USER_BOT: `${baseEndpoints.BASE_URL}/users/@me`,
  USER_GUILDS: `${baseEndpoints.BASE_URL}/@me/guilds`,
  USER_AVATAR: (userId: bigint, icon: string) => `${baseEndpoints.CDN_URL}/avatars/${userId}/${icon}`,
  USER_DEFAULT_AVATAR: (icon: number) => `${baseEndpoints.CDN_URL}/embed/avatars/${icon}.png`,
  USER_DM: `${baseEndpoints.BASE_URL}/users/@me/channels`,
  USER_CONNECTIONS: `${baseEndpoints.BASE_URL}/users/@me/connections`,
  USER_NICK: (guildId: bigint) => `${GUILDS_BASE(guildId)}/members/@me/nick`,

  // Discovery Endpoints
  DISCOVERY_CATEGORIES: `${baseEndpoints.BASE_URL}/discovery/categories`,
  DISCOVERY_VALID_TERM: `${baseEndpoints.BASE_URL}/discovery/valid-term`,
  DISCOVERY_MODIFY: (guildId: bigint) => `${GUILDS_BASE(guildId)}/discovery-metadata`,
  DISCOVERY_SUBCATEGORY: (guildId: bigint, categoryId: number) =>
    `${GUILDS_BASE(guildId)}/discovery-categories/${categoryId}`,

  // OAuth2
  OAUTH2_APPLICATION: `${baseEndpoints.BASE_URL}/oauth2/applications/@me`,

  // Stage instances
  STAGE_INSTANCES: `${baseEndpoints.BASE_URL}/stage-instances`,
  STAGE_INSTANCE: (channelId: bigint) => `${baseEndpoints.BASE_URL}/stage-instances/${channelId}`,
};

export const SLASH_COMMANDS_NAME_REGEX = /^[\w-]{1,32}$/;
export const CHANNEL_MENTION_REGEX = /<#[0-9]+>/g;
