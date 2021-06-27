// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/guild_application_command_permissions.ts


import { ApplicationCommandPermissions } from "./application_command_permissions.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#guildapplicationcommandpermissions */
export interface GuildApplicationCommandPermissions {
  /** The id of the command */
  id: string;
  /** The id of the application to command belongs to */
  applicationId: string;
  /** The id of the guild */
  guildId: string;
  /** The permissions for the command in the guild */
  permissions: ApplicationCommandPermissions[];
}
