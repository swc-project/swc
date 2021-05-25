// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/upsert_slash_command.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import type { ApplicationCommand } from "../../../types/interactions/commands/application_command.ts";
import type { EditGlobalApplicationCommand } from "../../../types/interactions/commands/edit_global_application_command.ts";
import { endpoints } from "../../../util/constants.ts";
import { validateSlashCommands } from "../../../util/utils.ts";

/**
 * Edit an existing slash command. If this command did not exist, it will create it.
 */
export async function upsertSlashCommand(commandId: bigint, options: EditGlobalApplicationCommand, guildId?: bigint) {
  [options] = validateSlashCommands([options]);

  return await rest.runMethod<ApplicationCommand>(
    "patch",
    guildId
      ? endpoints.COMMANDS_GUILD_ID(applicationId, guildId, commandId)
      : endpoints.COMMANDS_ID(applicationId, commandId),
    options
  );
}
