// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/allowed_mentions_types.ts


/** https://discord.com/developers/docs/resources/channel#allowed-mentions-object-allowed-mention-types */
export enum DiscordAllowedMentionsTypes {
  /** Controls role mentions */
  RoleMentions = "roles",
  /** Controls user mentions */
  UserMentions = "users",
  /** Controls @everyone and @here mentions */
  EveryoneMentions = "everyone",
}

export type AllowedMentionsTypes = DiscordAllowedMentionsTypes;
export const AllowedMentionsTypes = DiscordAllowedMentionsTypes;
