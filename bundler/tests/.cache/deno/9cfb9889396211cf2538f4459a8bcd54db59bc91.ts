// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/audit_log_entry.ts


import { AuditLogChange } from "./audit_log_change.ts";
import { DiscordAuditLogEvents } from "./audit_log_events.ts";
import { OptionalAuditEntryInfo } from "./optional_audit_entry_info.ts";

/** https://discord.com/developers/docs/resources/audit-log#audit-log-entry-object-audit-log-entry-structure */
export interface AuditLogEntry {
  /** id of the affected entity (webhook, user, role, etc.) */
  targetId: string | null;
  /** Changes made to the `target_id` */
  changes?: AuditLogChange[];
  /** The user who made the changes */
  userId: string | null;
  /** id of the entry */
  id: string;
  /** Type of action that occured */
  actionType: DiscordAuditLogEvents;
  /** Additional info for certain action types */
  options?: OptionalAuditEntryInfo;
  /** The reason for the change (0-512 characters) */
  reason?: string;
}
