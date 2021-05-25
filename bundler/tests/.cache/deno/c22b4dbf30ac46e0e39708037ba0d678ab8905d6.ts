// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/members/guild_member_remove.ts


import { User } from "../users/user.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-member-remove */
export interface GuildMemberRemove {
  /** The id of the guild */
  guildId: string;
  /** The user who was removed */
  user: User;
}
