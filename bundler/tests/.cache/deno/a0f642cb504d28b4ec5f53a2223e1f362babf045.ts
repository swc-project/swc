// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_role_create.ts


import { Role } from "../permissions/role.ts";

/** https://discord.com/developers/docs/topics/gateway#guild-role-create */
export interface GuildRoleCreate {
  /** The id of the guild */
  guildId: string;
  /** The role created */
  role: Role;
}
