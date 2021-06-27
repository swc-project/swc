// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/users/create_group_dm.ts


/** https://discord.com/developers/docs/resources/user#create-group-dm */
export interface CreateGroupDM {
  /** Access tokens of users that have granted your app the `gdm.join` scope */
  accessTokens: string[];
  /** A dictionary of user ids to their respective nicknames */
  nicks: Record<string, string>;
}
