// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/audit_log_events.ts


/** https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-events */
export enum DiscordAuditLogEvents {
  GuildUpdate = 1,
  ChannelCreate = 10,
  ChannelUpdate,
  ChannelDelete,
  ChannelOverwriteCreate,
  ChannelOverwriteUpdate,
  ChannelOverwriteDelete,
  MemberKick = 20,
  MemberPrune,
  MemberBanAdd,
  MemberBanRemove,
  MemberUpdate,
  MemberRoleUpdate,
  MemberMove,
  MemberDisconnect,
  BotAdd,
  RoleCreate = 30,
  RoleUpdate,
  RoleDelete,
  InviteCreate = 40,
  InviteUpdate,
  InviteDelete,
  WebhookCreate = 50,
  WebhookUpdate,
  WebhookDelete,
  EmojiCreate = 60,
  EmojiUpdate,
  EmojiDelete,
  MessageDelete = 72,
  MessageBulkDelete,
  MessagePin,
  MessageUnpin,
  IntegrationCreate = 80,
  IntegrationUpdate,
  IntegrationDelete,
}

export type AuditLogEvents = DiscordAuditLogEvents;
export const AuditLogEvents = DiscordAuditLogEvents;
