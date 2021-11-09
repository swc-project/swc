// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/teams/team_member.ts


import { User } from "../users/user.ts";
import { DiscordTeamMembershipStates } from "./team_membership_states.ts";

/** https://discord.com/developers/docs/topics/teams#data-models-team-members-object */
export interface TeamMember {
  /** The user's membership state on the team */
  membershipState: DiscordTeamMembershipStates;
  /** Will always be `["*"]` */
  permissions: ["*"];
  /** The id of the parent team of which they are a member */
  teamId: string;
  /** The avatar, discriminator, id, and username of the user */
  user: Partial<User> & Pick<User, "avatar" | "discriminator" | "id" | "username">;
}
