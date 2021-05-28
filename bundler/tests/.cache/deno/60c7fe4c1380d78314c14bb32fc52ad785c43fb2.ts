// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/audit_log/audit_log_change_value.ts


import { Overwrite } from "../channels/overwrite.ts";
import { Role } from "../permissions/role.ts";

/** https://discord.com/developers/docs/resources/audit-log#audit-log-change-object-audit-log-change-structure */
export type AuditLogChangeValue =
  | {
      newValue: string;
      oldValue: string;
      key:
        | "name"
        | "description"
        | "discovery_splash_hash"
        | "banner_hash"
        | "preferred_locale"
        | "rules_channel_id"
        | "public_updates_channel_id"
        | "icon_hash"
        | "splash_hash"
        | "owner_id"
        | "region"
        | "afk_channel_id"
        | "vanity_url_code"
        | "widget_channel_id"
        | "system_channel_id"
        | "topic"
        | "application_id"
        | "permissions"
        | "allow"
        | "deny"
        | "code"
        | "channel_id"
        | "inviter_id"
        | "nick"
        | "avatar_hash"
        | "id";
    }
  | {
      newValue: number;
      oldValue: number;
      key:
        | "afk_timeout"
        | "mfa_level"
        | "verification_level"
        | "explicit_content_filter"
        | "default_messagae_notifications"
        | "prune_delete_days"
        | "position"
        | "bitrate"
        | "rate_limit_per_user"
        | "color"
        | "max_uses"
        | "uses"
        | "max_age"
        | "expire_behavior"
        | "expire_grace_period"
        | "user_limit";
    }
  | {
      newValue: Partial<Role>;
      oldValue: Partial<Role>;
      key: "$add" | "$remove";
    }
  | {
      newValue: boolean;
      oldValue: boolean;
      key: "widget_enabled" | "nsfw" | "hoist" | "mentionable" | "temporary" | "deaf" | "mute" | "enable_emoticons";
    }
  | {
      newValue: Overwrite[];
      oldValue: Overwrite[];
      key: "permission_overwrites";
    }
  | {
      newValue: string | number;
      oldValue: string | number;
      key: "type";
    };
