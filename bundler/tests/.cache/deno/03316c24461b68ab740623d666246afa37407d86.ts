// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/mod.ts


import { handleChannelCreate } from "./channels/CHANNEL_CREATE.ts";
import { handleChannelDelete } from "./channels/CHANNEL_DELETE.ts";
import { handleChannelPinsUpdate } from "./channels/CHANNEL_PINS_UPDATE.ts";
import { handleChannelUpdate } from "./channels/CHANNEL_UPDATE.ts";
import { handleStageInstanceCreate } from "./channels/STAGE_INSTANCE_CREATE.ts";
import { handleStageInstanceUpdate } from "./channels/STAGE_INSTANCE_UPDATE.ts";
import { handleStageInstanceDelete } from "./channels/STAGE_INSTANCE_DELETE.ts";
import { handleThreadCreate } from "./channels/THREAD_CREATE.ts";
import { handleThreadDelete } from "./channels/THREAD_DELETE.ts";
import { handleThreadListSync } from "./channels/THREAD_LIST_SYNC.ts";
import { handleThreadMembersUpdate } from "./channels/THREAD_MEMBERS_UPDATE.ts";
import { handleThreadMemberUpdate } from "./channels/THREAD_MEMBER_UPDATE.ts";
import { handleThreadUpdate } from "./channels/THREAD_UPDATE.ts";
import { handleApplicationCommandCreate } from "./commands/APPLICATION_COMMAND_CREATE.ts";
import { handleApplicationCommandDelete } from "./commands/APPLICATION_COMMAND_DELETE.ts";
import { handleApplicationCommandUpdate } from "./commands/APPLICATION_COMMAND_UPDATE.ts";
import { handleGuildEmojisUpdate } from "./emojis/GUILD_EMOJIS_UPDATE.ts";
import { handleGuildBanAdd } from "./guilds/GUILD_BAN_ADD.ts";
import { handleGuildBanRemove } from "./guilds/GUILD_BAN_REMOVE.ts";
import { handleGuildCreate } from "./guilds/GUILD_CREATE.ts";
import { handleGuildDelete } from "./guilds/GUILD_DELETE.ts";
import { handleGuildIntegrationsUpdate } from "./guilds/GUILD_INTEGRATIONS_UPDATE.ts";
import { handleGuildUpdate } from "./guilds/GUILD_UPDATE.ts";
import { handleIntegrationCreate } from "./integrations/INTEGRATION_CREATE.ts";
import { handleIntegrationDelete } from "./integrations/INTEGRATION_DELETE.ts";
import { handleIntegrationUpdate } from "./integrations/INTEGRATION_UPDATE.ts";
import { handleInteractionCreate } from "./interactions/INTERACTION_CREATE.ts";
import { handleInviteCreate } from "./invites/INVITE_CREATE.ts";
import { handleGuildMembersChunk } from "./members/GUILD_MEMBERS_CHUNK.ts";
import { handleGuildMemberAdd } from "./members/GUILD_MEMBER_ADD.ts";
import { handleGuildMemberRemove } from "./members/GUILD_MEMBER_REMOVE.ts";
import { handleGuildMemberUpdate } from "./members/GUILD_MEMBER_UPDATE.ts";
import { handleMessageCreate } from "./messages/MESSAGE_CREATE.ts";
import { handleMessageDelete } from "./messages/MESSAGE_DELETE.ts";
import { handleMessageDeleteBulk } from "./messages/MESSAGE_DELETE_BULK.ts";
import { handleMessageReactionAdd } from "./messages/MESSAGE_REACTION_ADD.ts";
import { handleMessageReactionRemove } from "./messages/MESSAGE_REACTION_REMOVE.ts";
import { handleMessageReactionRemoveAll } from "./messages/MESSAGE_REACTION_REMOVE_ALL.ts";
import { handleMessageReactionRemoveEmoji } from "./messages/MESSAGE_REACTION_REMOVE_EMOJI.ts";
import { handleMessageUpdate } from "./messages/MESSAGE_UPDATE.ts";
import { handlePresenceUpdate } from "./misc/PRESENCE_UPDATE.ts";
import { handleReady } from "./misc/READY.ts";
import { handleTypingStart } from "./misc/TYPING_START.ts";
import { handleUserUpdate } from "./misc/USER_UPDATE.ts";
import { handleGuildRoleCreate } from "./roles/GUILD_ROLE_CREATE.ts";
import { handleGuildRoleDelete } from "./roles/GUILD_ROLE_DELETE.ts";
import { handleGuildRoleUpdate } from "./roles/GUILD_ROLE_UPDATE.ts";
import { handleVoiceServerUpdate } from "./voice/VOICE_SERVER_UPDATE.ts";
import { handleVoiceStateUpdate } from "./voice/VOICE_STATE_UPDATE.ts";
import { handleWebhooksUpdate } from "./webhooks/WEBHOOKS_UPDATE.ts";

export {
  handleApplicationCommandCreate,
  handleApplicationCommandDelete,
  handleApplicationCommandUpdate,
  handleChannelCreate,
  handleChannelDelete,
  handleChannelPinsUpdate,
  handleChannelUpdate,
  handleGuildBanAdd,
  handleGuildBanRemove,
  handleGuildCreate,
  handleGuildDelete,
  handleGuildEmojisUpdate,
  handleGuildIntegrationsUpdate,
  handleGuildMemberAdd,
  handleGuildMemberRemove,
  handleGuildMembersChunk,
  handleGuildMemberUpdate,
  handleGuildRoleCreate,
  handleGuildRoleDelete,
  handleGuildRoleUpdate,
  handleGuildUpdate,
  handleIntegrationCreate,
  handleIntegrationDelete,
  handleIntegrationUpdate,
  handleInteractionCreate,
  handleInviteCreate,
  handleMessageCreate,
  handleMessageDelete,
  handleMessageDeleteBulk,
  handleMessageReactionAdd,
  handleMessageReactionRemove,
  handleMessageReactionRemoveAll,
  handleMessageReactionRemoveEmoji,
  handleMessageUpdate,
  handlePresenceUpdate,
  handleReady,
  handleStageInstanceCreate,
  handleStageInstanceDelete,
  handleStageInstanceUpdate,
  handleThreadCreate,
  handleThreadDelete,
  handleThreadListSync,
  handleThreadMembersUpdate,
  handleThreadMemberUpdate,
  handleThreadUpdate,
  handleTypingStart,
  handleUserUpdate,
  handleVoiceServerUpdate,
  handleVoiceStateUpdate,
  handleWebhooksUpdate,
};

export let handlers = {
  // misc
  READY: handleReady,
  // channels
  CHANNEL_CREATE: handleChannelCreate,
  CHANNEL_DELETE: handleChannelDelete,
  CHANNEL_PINS_UPDATE: handleChannelPinsUpdate,
  CHANNEL_UPDATE: handleChannelUpdate,
  THREAD_CREATE: handleThreadCreate,
  THREAD_UPDATE: handleThreadUpdate,
  THREAD_DELETE: handleThreadDelete,
  THREAD_LIST_SYNC: handleThreadListSync,
  THREAD_MEMBER_UPDATE: handleThreadMemberUpdate,
  THREAD_MEMBERS_UPDATE: handleThreadMembersUpdate,
  STAGE_INSTANCE_CREATE: handleStageInstanceCreate,
  STAGE_INSTANCE_UPDATE: handleStageInstanceUpdate,
  STAGE_INSTANCE_DELETE: handleStageInstanceDelete,

  // commands
  APPLICATION_COMMAND_CREATE: handleApplicationCommandCreate,
  APPLICATION_COMMAND_DELETE: handleApplicationCommandDelete,
  APPLICATION_COMMAND_UPDATE: handleApplicationCommandUpdate,
  // guilds
  GUILD_BAN_ADD: handleGuildBanAdd,
  GUILD_BAN_REMOVE: handleGuildBanRemove,
  GUILD_CREATE: handleGuildCreate,
  GUILD_DELETE: handleGuildDelete,
  GUILD_EMOJIS_UPDATE: handleGuildEmojisUpdate,
  GUILD_INTEGRATIONS_UPDATE: handleGuildIntegrationsUpdate,
  GUILD_MEMBER_ADD: handleGuildMemberAdd,
  GUILD_MEMBER_REMOVE: handleGuildMemberRemove,
  GUILD_MEMBER_UPDATE: handleGuildMemberUpdate,
  GUILD_MEMBERS_CHUNK: handleGuildMembersChunk,
  GUILD_ROLE_CREATE: handleGuildRoleCreate,
  GUILD_ROLE_DELETE: handleGuildRoleDelete,
  GUILD_ROLE_UPDATE: handleGuildRoleUpdate,
  GUILD_UPDATE: handleGuildUpdate,
  // interactions
  INTERACTION_CREATE: handleInteractionCreate,
  // invites
  INVITE_CREATE: handleInviteCreate,
  INVITE_DELETE: handleInviteCreate,
  // messages
  MESSAGE_CREATE: handleMessageCreate,
  MESSAGE_DELETE_BULK: handleMessageDeleteBulk,
  MESSAGE_DELETE: handleMessageDelete,
  MESSAGE_REACTION_ADD: handleMessageReactionAdd,
  MESSAGE_REACTION_REMOVE_ALL: handleMessageReactionRemoveAll,
  MESSAGE_REACTION_REMOVE_EMOJI: handleMessageReactionRemoveEmoji,
  MESSAGE_REACTION_REMOVE: handleMessageReactionRemove,
  MESSAGE_UPDATE: handleMessageUpdate,
  // presence
  PRESENCE_UPDATE: handlePresenceUpdate,
  TYPING_START: handleTypingStart,
  USER_UPDATE: handleUserUpdate,
  // voice
  VOICE_SERVER_UPDATE: handleVoiceServerUpdate,
  VOICE_STATE_UPDATE: handleVoiceStateUpdate,
  // webhooks
  WEBHOOKS_UPDATE: handleWebhooksUpdate,
  // integrations
  INTEGRATION_CREATE: handleIntegrationCreate,
  INTEGRATION_UPDATE: handleIntegrationUpdate,
  INTEGRATION_DELETE: handleIntegrationDelete,
};

export type Handlers = typeof handlers;

export function updateHandlers(newHandlers: Handlers) {
  handlers = {
    ...handlers,
    ...newHandlers,
  };
}
