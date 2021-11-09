// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/audit_log.ts


import { Integration } from "../integrations/integration.ts";
import { User } from "../users/user.ts";
import { Webhook } from "../webhooks/webhook.ts";
import { AuditLogEntry } from "./audit_log_entry.ts";

/** https://discord.com/developers/docs/resources/audit-log#audit-log-object */
export interface AuditLog {
  /** List of webhooks found in the audit log */
  webhooks: Webhook[];
  /** List of users found in the audit log */
  users: User[];
  /** List of audit log entries */
  auditLogEntries: AuditLogEntry[];
  /** List of partial integration objects */
  integrations: Partial<Integration>[];
}
