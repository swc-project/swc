// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/teams/team_membership_states.ts


/** https://discord.com/developers/docs/topics/teams#data-models-membership-state-enum */
export enum DiscordTeamMembershipStates {
  Invited = 1,
  Accepted,
}

export type TeamMembershipStates = DiscordTeamMembershipStates;
export const TeamMembershipStates = DiscordTeamMembershipStates;
