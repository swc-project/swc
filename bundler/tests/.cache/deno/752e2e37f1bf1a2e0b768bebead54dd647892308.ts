// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/members/guild_member_update.ts


import { User } from "../users/user.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-member-update */
export interface GuildMemberUpdate {
  /** The id of the guild */
  guildId: string;
  /** User role ids */
  roles: string[];
  /** The user */
  user: User;
  /** Nickname of the user in the guild */
  nick?: string | null;
  /** When the user joined the guild */
  joinedAt: string | null;
  /** When the user starting boosting the guild */
  premiumSince?: string | null;
  /** Whether the user has not yet passed the guild's Membership Screening requirements */
  pending?: boolean;
  /** whether the user is deafened in voice channels */
  deaf?: boolean;
  /** whether the user is muted in voice channels */
  mute?: boolean;
}
