// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command_create_update_delete.ts


import { ApplicationCommand } from "./application_command.ts";

/** https://discord.com/developers/docs/topics/gateway#application-command-delete-application-command-extra-fields */
export interface ApplicationCommandCreateUpdateDelete extends ApplicationCommand {
  /** Id of the guild the command is in */
  guildId?: string;
}
