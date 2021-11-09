// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/optional_audit_entry_info.ts


/** https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-optional-audit-entry-info */
export interface OptionalAuditEntryInfo {
  /** Number of days after which inactive members were kicked */
  deleteMemberDays: string;
  /** Number of members removed by the prune */
  membersRemoved: string;
  /** Channel in which the entities were targeted */
  channelId: string;
  /** id of the message that was targeted, types: MESSAGE_PIN & MESSAGE_UNPIN */
  messageId: string;
  /** Number of entities that were targeted */
  count: string;
  /** id of the overwritten entity */
  id: string;
  /** type of overwritten entity - "0", for "role", or "1" for "member" */
  type: string;
  /** Name of the role if type is "0" (not present if type is "1") */
  roleName: string;
}
