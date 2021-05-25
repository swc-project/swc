// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/create_guild_ban.ts


/** https://discord.com/developers/docs/resources/guild#create-guild-ban */
export interface CreateGuildBan {
  /** Number of days to delete messages for (0-7) */
  deleteMessageDays?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** Reason for the ban */
  reason?: string;
}
