// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_preview.ts


import { Emoji } from "../emojis/emoji.ts";
import { DiscordGuildFeatures } from "./guild_features.ts";

/** https://discord.com/developers/docs/resources/guild#guild-preview-object */
export interface GuildPreview {
  /** Guild id */
  id: string;
  /** Guild name (2-100 characters) */
  name: string;
  /** Icon hash */
  icon: string | null;
  /** Splash hash */
  splash: string | null;
  /** Discovery splash hash */
  discoverySplash: string | null;
  /** Custom guild emojis */
  emojis: Emoji[];
  /** Enabled guild features */
  features: DiscordGuildFeatures[];
  /** Approximate number of members in this guild */
  approximateMemberCount: number;
  /** Approximate number of online members in this guild */
  approximatePresenceCount: number;
  /** The description for the guild, if the guild is discoverable */
  description: string | null;
}
