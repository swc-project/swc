// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_role_delete.ts


/** https://discord.com/developers/docs/topics/gateway#guild-role-delete */
export interface GuildRoleDelete {
  /** id of the guild */
  guildId: string;
  /** id of the role */
  roleId: string;
}
