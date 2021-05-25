// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/users/modify_current_user.ts


/** https://discord.com/developers/docs/resources/user#modify-current-user */
export interface ModifyCurrentUser {
  /** User's username, if changed may cause the user's discriminator to be randomized. */
  username?: string;
  /** If passed, modifies the user's avatar */
  avatar?: string;
}
