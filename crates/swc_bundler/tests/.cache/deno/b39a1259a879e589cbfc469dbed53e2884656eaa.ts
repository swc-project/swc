// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/invites/invite_delete.ts


/** https://discord.com/developers/docs/topics/gateway#invite-delete */
export interface InviteDelete {
  /** The channel of the invite */
  channelId: string;
  /** The guild of the invite */
  guildId?: string;
  /** The unique invite code */
  code: string;
}
