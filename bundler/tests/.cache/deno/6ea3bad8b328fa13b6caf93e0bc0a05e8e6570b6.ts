// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discordeno/create_slash_command.ts


import { CreateGlobalApplicationCommand } from "../interactions/commands/create_global_application_command.ts";

export interface DiscordenoCreateApplicationCommand extends CreateGlobalApplicationCommand {
  /** Id of the guild to create a guild only application command */
  guildId: string;
}
