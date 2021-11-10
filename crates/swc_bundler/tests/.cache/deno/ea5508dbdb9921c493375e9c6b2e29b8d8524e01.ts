// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/members/modify_current_user_nick.ts


/** https://discord.com/developers/docs/resources/guild#modify-current-user-nick */
export interface ModifyCurrentUserNick {
  /** Value to set users nickname to. Requires the CHANGENICKNAME permission */
  nick?: string | null;
}
