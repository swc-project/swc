// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/mod.ts


import { categoryChildren } from "./channels/category_children.ts";
import { channelOverwriteHasPermission } from "./channels/channel_overwrite_has_permission.ts";
import { createChannel } from "./channels/create_channel.ts";
import { deleteChannel } from "./channels/delete_channel.ts";
import { deleteChannelOverwrite } from "./channels/delete_channel_overwrite.ts";
import { editChannel } from "./channels/edit_channel.ts";
import { editChannelOverwrite } from "./channels/edit_channel_overwrite.ts";
import { followChannel } from "./channels/follow_channel.ts";
import { getChannel } from "./channels/get_channel.ts";
import { getChannels } from "./channels/get_channels.ts";
import { getChannelWebhooks } from "./channels/get_channel_webhooks.ts";
import { getPins } from "./channels/get_pins.ts";
import { isChannelSynced } from "./channels/is_channel_synced.ts";
import { startTyping } from "./channels/start_typing.ts";
import { swapChannels } from "./channels/swap_channels.ts";
import { updateBotVoiceState } from "./channels/update_voice_state.ts";
import { addDiscoverySubcategory } from "./discovery/add_discovery_subcategory.ts";
import { editDiscovery } from "./discovery/edit_discovery.ts";
import { getDiscoveryCategories } from "./discovery/get_discovery_categories.ts";
import { removeDiscoverySubcategory } from "./discovery/remove_discovery_subcategory.ts";
import { validDiscoveryTerm } from "./discovery/valid_discovery_term.ts";
import { createEmoji } from "./emojis/create_emoji.ts";
import { deleteEmoji } from "./emojis/delete_emoji.ts";
import { editEmoji } from "./emojis/edit_emoji.ts";
import { emojiURL } from "./emojis/emoji_url.ts";
import { getEmoji } from "./emojis/get_emoji.ts";
import { getEmojis } from "./emojis/get_emojis.ts";
import { createGuild } from "./guilds/create_guild.ts";
import { deleteGuild } from "./guilds/delete_guild.ts";
import { editGuild } from "./guilds/edit_guild.ts";
import { editWelcomeScreen } from "./guilds/edit_welcome_screen.ts";
import { editWidget } from "./guilds/edit_widget.ts";
import { getAuditLogs } from "./guilds/get_audit_logs.ts";
import { getAvailableVoiceRegions } from "./guilds/get_available_voice_regions.ts";
import { getBan } from "./guilds/get_ban.ts";
import { getBans } from "./guilds/get_bans.ts";
import { getGuild } from "./guilds/get_guild.ts";
import { getGuildPreview } from "./guilds/get_guild_preview.ts";
import { getPruneCount } from "./guilds/get_prune_count.ts";
import { getVanityURL } from "./guilds/get_vainty_url.ts";
import { getVoiceRegions } from "./guilds/get_voice_regions.ts";
import { getWelcomeScreen } from "./guilds/get_welcome_screen.ts";
import { getWidget } from "./guilds/get_widget.ts";
import { getWidgetImageURL } from "./guilds/get_widget_image_url.ts";
import { getWidgetSettings } from "./guilds/get_widget_settings.ts";
import { guildBannerURL } from "./guilds/guild_banner_url.ts";
import { guildIconURL } from "./guilds/guild_icon_url.ts";
import { guildSplashURL } from "./guilds/guild_splash_url.ts";
import { leaveGuild } from "./guilds/leave_guild.ts";
import { deleteIntegration } from "./integrations/delete_integration.ts";
import { getIntegrations } from "./integrations/get_integrations.ts";
import { batchEditSlashCommandPermissions } from "./interactions/commands/batch_edit_slash_command_permissions.ts";
import { createSlashCommand } from "./interactions/commands/create_slash_command.ts";
import { deleteSlashCommand } from "./interactions/commands/delete_slash_command.ts";
import { deleteSlashResponse } from "./interactions/commands/delete_slash_response.ts";
import { editSlashCommandPermissions } from "./interactions/commands/edit_slash_command_permissions.ts";
import { editSlashResponse } from "./interactions/commands/edit_slash_response.ts";
import { getSlashCommand } from "./interactions/commands/get_slash_command.ts";
import { getSlashCommands } from "./interactions/commands/get_slash_commands.ts";
import { getSlashCommandPermission } from "./interactions/commands/get_slash_command_permission.ts";
import { getSlashCommandPermissions } from "./interactions/commands/get_slash_command_permissions.ts";
import { upsertSlashCommand } from "./interactions/commands/upsert_slash_command.ts";
import { upsertSlashCommands } from "./interactions/commands/upsert_slash_commands.ts";
import { getOriginalInteractionResponse } from "./interactions/get_original_interaction_response.ts";
import { sendInteractionResponse } from "./interactions/send_interaction_response.ts";
import { createInvite } from "./invites/create_invite.ts";
import { deleteInvite } from "./invites/delete_invite.ts";
import { getChannelInvites } from "./invites/get_channel_invites.ts";
import { getInvite } from "./invites/get_invite.ts";
import { getInvites } from "./invites/get_invites.ts";
import { avatarURL } from "./members/avatar_url.ts";
import { ban, banMember } from "./members/ban_member.ts";
import { disconnectMember } from "./members/disconnect_member.ts";
import { editBotNickname } from "./members/edit_bot_nickname.ts";
import { editMember } from "./members/edit_member.ts";
import { fetchMembers } from "./members/fetch_members.ts";
import { getMember } from "./members/get_member.ts";
import { getMembers } from "./members/get_members.ts";
import { kick, kickMember } from "./members/kick_member.ts";
import { moveMember } from "./members/move_member.ts";
import { pruneMembers } from "./members/prune_members.ts";
import { sendDirectMessage } from "./members/send_direct_message.ts";
import { unban, unbanMember } from "./members/unban_member.ts";
import { addReaction } from "./messages/add_reaction.ts";
import { addReactions } from "./messages/add_reactions.ts";
import { deleteMessage } from "./messages/delete_message.ts";
import { deleteMessages } from "./messages/delete_messages.ts";
import { editMessage } from "./messages/edit_message.ts";
import { getMessage } from "./messages/get_message.ts";
import { getMessages } from "./messages/get_messages.ts";
import { getReactions } from "./messages/get_reactions.ts";
import { pin, pinMessage } from "./messages/pin_message.ts";
import { publishMessage } from "./messages/publish_message.ts";
import { removeAllReactions } from "./messages/remove_all_reactions.ts";
import { removeReaction } from "./messages/remove_reaction.ts";
import { removeReactionEmoji } from "./messages/remove_reaction_emoji.ts";
import { sendMessage } from "./messages/send_message.ts";
import { unpin, unpinMessage } from "./messages/unpin_message.ts";
import { editBotProfile } from "./misc/edit_bot_profile.ts";
import { editBotStatus } from "./misc/edit_bot_status.ts";
import { getGatewayBot } from "./misc/get_gateway_bot.ts";
import { getUser } from "./misc/get_user.ts";
import { addRole } from "./roles/add_role.ts";
import { createRole } from "./roles/create_role.ts";
import { deleteRole } from "./roles/delete_role.ts";
import { editRole } from "./roles/edit_role.ts";
import { getRoles } from "./roles/get_roles.ts";
import { removeRole } from "./roles/remove_role.ts";
import { createGuildFromTemplate } from "./templates/create_guild_from_template.ts";
import { createGuildTemplate } from "./templates/create_guild_template.ts";
import { deleteGuildTemplate } from "./templates/delete_guild_template.ts";
import { editGuildTemplate } from "./templates/edit_guild_template.ts";
import { getGuildTemplates } from "./templates/get_guild_templates.ts";
import { getTemplate } from "./templates/get_template.ts";
import { syncGuildTemplate } from "./templates/sync_guild_template.ts";
// Type Guards
import { isActionRow } from "./type_guards/is_action_row.ts";
import { isButton } from "./type_guards/is_button.ts";
import { createWebhook } from "./webhooks/create_webhook.ts";
import { deleteWebhook } from "./webhooks/delete_webhook.ts";
import { deleteWebhookMessage } from "./webhooks/delete_webhook_message.ts";
import { deleteWebhookWithToken } from "./webhooks/delete_webhook_with_token.ts";
import { editWebhook } from "./webhooks/edit_webhook.ts";
import { editWebhookMessage } from "./webhooks/edit_webhook_message.ts";
import { editWebhookWithToken } from "./webhooks/edit_webhook_with_token.ts";
import { getWebhook } from "./webhooks/get_webhook.ts";
import { getWebhooks } from "./webhooks/get_webhooks.ts";
import { getWebhookMessage } from "./webhooks/get_webhook_message.ts";
import { getWebhookWithToken } from "./webhooks/get_webhook_with_token.ts";
import { sendWebhook } from "./webhooks/send_webhook.ts";
import { createStageInstance } from "./channels/create_stage_instance.ts";
import { updateStageInstance } from "./channels/update_stage_instance.ts";
import { getStageInstance } from "./channels/get_stage_instance.ts";
import { deleteStageInstance } from "./channels/delete_stage_instance.ts";

export {
  addDiscoverySubcategory,
  addReaction,
  addReactions,
  addRole,
  avatarURL,
  ban,
  banMember,
  batchEditSlashCommandPermissions,
  categoryChildren,
  channelOverwriteHasPermission,
  createChannel,
  createEmoji,
  createGuild,
  createGuildFromTemplate,
  createGuildTemplate,
  createInvite,
  createRole,
  createSlashCommand,
  createStageInstance,
  createWebhook,
  deleteChannel,
  deleteChannelOverwrite,
  deleteEmoji,
  deleteGuild,
  deleteGuildTemplate,
  deleteIntegration,
  deleteInvite,
  deleteMessage,
  deleteMessages,
  deleteRole,
  deleteSlashCommand,
  deleteSlashResponse,
  deleteStageInstance,
  deleteWebhook,
  deleteWebhookMessage,
  deleteWebhookWithToken,
  disconnectMember,
  editBotNickname,
  editBotProfile,
  editBotStatus,
  editChannel,
  editChannelOverwrite,
  editDiscovery,
  editEmoji,
  editGuild,
  editGuildTemplate,
  editMember,
  editMessage,
  editRole,
  editSlashResponse,
  editWebhook,
  editWebhookMessage,
  editWebhookWithToken,
  editWelcomeScreen,
  editWidget,
  emojiURL,
  fetchMembers,
  followChannel,
  getAuditLogs,
  getAvailableVoiceRegions,
  getBan,
  getBans,
  getChannel,
  getChannelInvites,
  getChannels,
  getChannelWebhooks,
  getDiscoveryCategories,
  getEmoji,
  getEmojis,
  getGatewayBot,
  getGuild,
  getGuildPreview,
  getGuildTemplates,
  getIntegrations,
  getInvite,
  getInvites,
  getMember,
  getMembers,
  getMessage,
  getMessages,
  getOriginalInteractionResponse,
  getPins,
  getPruneCount,
  getReactions,
  getRoles,
  getSlashCommand,
  getSlashCommandPermission,
  getSlashCommandPermissions,
  getSlashCommands,
  getStageInstance,
  getTemplate,
  getUser,
  getVanityURL,
  getVoiceRegions,
  getWebhook,
  getWebhookMessage,
  getWebhooks,
  getWebhookWithToken,
  getWelcomeScreen,
  getWidget,
  getWidgetImageURL,
  getWidgetSettings,
  guildBannerURL,
  guildIconURL,
  guildSplashURL,
  isActionRow,
  isButton,
  isChannelSynced,
  kick,
  kickMember,
  leaveGuild,
  moveMember,
  pin,
  pinMessage,
  pruneMembers,
  publishMessage,
  removeAllReactions,
  removeDiscoverySubcategory,
  removeReaction,
  removeReactionEmoji,
  removeRole,
  sendDirectMessage,
  sendInteractionResponse,
  sendMessage,
  sendWebhook,
  startTyping,
  swapChannels,
  syncGuildTemplate,
  unban,
  unbanMember,
  unpin,
  unpinMessage,
  updateBotVoiceState,
  updateStageInstance,
  upsertSlashCommand,
  upsertSlashCommands,
  validDiscoveryTerm,
};

export let helpers = {
  // channels
  channelOverwriteHasPermission,
  createChannel,
  deleteChannelOverwrite,
  deleteChannel,
  editChannelOverwrite,
  editChannel,
  followChannel,
  getChannelWebhooks,
  getChannel,
  getChannels,
  getPins,
  isChannelSynced,
  startTyping,
  swapChannels,
  updateBotVoiceState,
  createStageInstance,
  getStageInstance,
  updateStageInstance,
  deleteStageInstance,
  // commands
  createSlashCommand,
  deleteSlashCommand,
  deleteSlashResponse,
  editSlashResponse,
  getSlashCommandPermission,
  getSlashCommandPermissions,
  batchEditSlashCommandPermissions,
  editSlashCommandPermissions,
  sendInteractionResponse,
  getSlashCommand,
  getSlashCommands,
  upsertSlashCommand,
  upsertSlashCommands,
  getOriginalInteractionResponse,
  // emojis
  createEmoji,
  deleteEmoji,
  editEmoji,
  getEmoji,
  getEmojis,
  // guilds
  categoryChildren,
  createGuild,
  deleteGuild,
  editGuild,
  editWidget,
  editWelcomeScreen,
  emojiURL,
  getAuditLogs,
  getAvailableVoiceRegions,
  getBan,
  getBans,
  getGuildPreview,
  getGuild,
  getWelcomeScreen,
  getPruneCount,
  getVanityURL,
  getVoiceRegions,
  getWidgetImageURL,
  getWidgetSettings,
  getWidget,
  guildBannerURL,
  guildIconURL,
  guildSplashURL,
  leaveGuild,
  // discovery
  addDiscoverySubcategory,
  editDiscovery,
  getDiscoveryCategories,
  removeDiscoverySubcategory,
  validDiscoveryTerm,
  // integrations
  deleteIntegration,
  getIntegrations,
  // invites
  createInvite,
  deleteInvite,
  getChannelInvites,
  getInvite,
  getInvites,
  // members
  avatarURL,
  banMember,
  disconnectMember,
  editBotNickname,
  editBotProfile,
  editMember,
  fetchMembers,
  getMember,
  getMembers,
  kickMember,
  moveMember,
  pruneMembers,
  sendDirectMessage,
  unbanMember,
  // messages
  addReaction,
  addReactions,
  deleteMessage,
  deleteMessages,
  editMessage,
  getMessage,
  getMessages,
  getReactions,
  pinMessage,
  publishMessage,
  removeAllReactions,
  removeReactionEmoji,
  removeReaction,
  sendMessage,
  unpinMessage,
  // misc
  getGatewayBot,
  getUser,
  // roles
  addRole,
  createRole,
  deleteRole,
  editRole,
  getRoles,
  removeRole,
  // templates
  createGuildFromTemplate,
  createGuildTemplate,
  deleteGuildTemplate,
  editGuildTemplate,
  getGuildTemplates,
  getTemplate,
  syncGuildTemplate,
  // webhooks
  createWebhook,
  deleteWebhookMessage,
  deleteWebhookWithToken,
  deleteWebhook,
  editWebhookMessage,
  editWebhookWithToken,
  editWebhook,
  sendWebhook,
  getWebhookWithToken,
  getWebhook,
  getWebhooks,
  getWebhookMessage,
};

export type Helpers = typeof helpers;

export function updateHelpers(newHelpers: Partial<Helpers>) {
  helpers = {
    ...helpers,
    ...newHelpers,
  };
}
