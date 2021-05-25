// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/modify_guild_channel_position.ts


/** https://discord.com/developers/docs/resources/guild#modify-guild-channel-positions */
export interface ModifyGuildChannelPositions {
  /** Channel id */
  id: string;
  /** Sorting position of the channel */
  position: number | null;
  /** Syncs the permission overwrites with the new parent, if moving to a new category */
  lockPositions?: boolean | null;
  /** The new parent ID for the channel that is moved */
  parentId?: string | null;
}
