// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/interaction_guild_member.ts


import { GuildMemberWithUser } from "../members/guild_member.ts";

/** https://discord.com/developers/docs/resources/guild#guild-member-object */
export interface InteractionGuildMember extends GuildMemberWithUser {
  /** Total permissions of the member in the channel, including overwrites, returned when in the interaction object */
  permissions: string;
}
