// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/modify_guild.ts


import { DiscordDefaultMessageNotificationLevels } from "./default_message_notification_levels.ts";
import { DiscordExplicitContentFilterLevels } from "./explicit_content_filter_levels.ts";
import { DiscordGuildFeatures } from "./guild_features.ts";
import { DiscordSystemChannelFlags } from "./system_channel_flags.ts";
import { DiscordVerificationLevels } from "./verification_levels.ts";

/** https://discord.com/developers/docs/resources/guild#modify-guild */
export interface ModifyGuild {
  /** Guild name */
  name?: string;
  /** Guild voice region id */
  region?: string | null;
  /** Verification level */
  verificationLevel?: DiscordVerificationLevels | null;
  /** Default message notification filter level */
  defaultMessageNotifications?: DiscordDefaultMessageNotificationLevels | null;
  /** Explicit content filter level */
  explicitContentFilter?: DiscordExplicitContentFilterLevels | null;
  /** Id for afk channel */
  afkChannelId?: string | null;
  /** Afk timeout in seconds */
  afkTimeout?: number;
  /** Base64 1024x1024 png/jpeg/gif image for the guild icon (can be animated gif when the server has the `ANIMATED_ICON` feature) */
  icon?: string | null;
  /** User id to transfer guild ownership to (must be owner) */
  ownerId?: string;
  /** Base64 16:9 png/jpeg image for the guild splash (when the server has `INVITE_SPLASH` feature) */
  splash?: string | null;
  /** Base64 16:9 png/jpeg image for the guild discovery spash (when the server has the `DISCOVERABLE` feature) */
  discoverySplash?: string | null;
  /** Base64 16:9 png/jpeg image for the guild banner (when the server has BANNER feature) */
  banner?: string | null;
  /** The id of the channel where guild notices such as welcome messages and boost events are posted */
  systemChannelId?: string | null;
  /** System channel flags */
  systemChannelFlags?: DiscordSystemChannelFlags;
  /** The id of the channel where Community guilds display rules and/or guidelines */
  rulesChannelId?: string | null;
  /** The id of the channel where admins and moderators of Community guilds receive notices from Discord */
  publicUpdatesChannelId?: string | null;
  /** The preferred locale of a Community guild used in server discovery and notices from Discord; defaults to "en-US" */
  preferredLocale?: string | null;
  /** Enabled guild features */
  features?: DiscordGuildFeatures[];
}
