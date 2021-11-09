// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command_interaction_data_resolved.ts


import { Channel } from "../../channels/channel.ts";
import { Role } from "../../permissions/role.ts";
import { User } from "../../users/user.ts";
import { InteractionGuildMember } from "../interaction_guild_member.ts";

export interface ApplicationCommandInteractionDataResolved {
  /** The Ids and User objects */
  users?: Record<string, User>;
  /** The Ids and partial Member objects */
  members?: Record<string, Omit<InteractionGuildMember, "user" | "deaf" | "mute">>;
  /** The Ids and Role objects */
  roles?: Record<string, Role>;
  /** The Ids and partial Channel objects */
  channels?: Record<string, Pick<Channel, "id" | "name" | "type" | "permissionOverwrites">>;
}
