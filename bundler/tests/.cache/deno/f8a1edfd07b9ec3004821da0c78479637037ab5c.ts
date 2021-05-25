// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/audit_log_change.ts


import { AuditLogChangeValue } from "./audit_log_change_value.ts";

/** https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-structure */
export interface AuditLogChange {
  /** New value of the key */
  newValue?: AuditLogChangeValue;
  /** Old value of the key */
  oldValue?: AuditLogChangeValue;
  /** Name of audit log change key */
  key: string;
}
