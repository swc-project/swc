// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_role_update.ts


import { Role } from "../permissions/role.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-role-update */
export interface GuildRoleUpdate {
  /** The id of the guild */
  guildId: string;
  /** The role updated */
  role: Role;
}
