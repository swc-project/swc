// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_ban_remove.ts


import { User } from "../users/user.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-ban-remove */
export interface GuildBanRemove {
  /** id of the guild */
  guildId: string;
  /** The unbanned user */
  user: User;
}
