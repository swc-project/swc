// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_get_reactions.ts


/** https://discord.com/developers/docs/resources/channel#get-reactions-query-string-params */
export interface GetReactions {
  /** Get users after this user Id */
  after?: string;
  /** Max number of users to return (1-100) */
  limit?: number;
}
