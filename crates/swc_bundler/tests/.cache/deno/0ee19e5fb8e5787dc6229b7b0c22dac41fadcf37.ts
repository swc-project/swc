// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/get_guild_prune_count.ts


/** https://discord.com/developers/docs/resources/guild#get-guild-prune-count */
export interface GetGuildPruneCountQuery {
  /** Number of days to count prune for (1 or more), default: 7 */
  days?: number;
  /** Role(s) to include, default: none */
  includeRoles: string | string[];
}
