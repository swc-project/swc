// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/modify_guild_role_positions.ts


/** https://discord.com/developers/docs/resources/guild#modify-guild-role-positions */
export interface ModifyGuildRolePositions {
  /** Role id */
  id: string;
  /** Sorting position of the role */
  position?: number | null;
}
