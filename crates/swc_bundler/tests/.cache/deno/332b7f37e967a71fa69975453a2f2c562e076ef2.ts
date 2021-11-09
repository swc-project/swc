// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/members/guild_member_add.ts


import { GuildMemberWithUser } from "../members/guild_member.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-member-add */
export interface GuildMemberAdd extends GuildMemberWithUser {
  /** id of the guild */
  guildId: string;
}
