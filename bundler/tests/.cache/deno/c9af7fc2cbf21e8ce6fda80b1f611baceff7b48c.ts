// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/upsert_slash_commands.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import type { ApplicationCommand } from "../../../types/interactions/commands/application_command.ts";
import type { EditGlobalApplicationCommand } from "../../../types/interactions/commands/edit_global_application_command.ts";
import { endpoints } from "../../../util/constants.ts";
import { validateSlashCommands } from "../../../util/utils.ts";

/**
 * Bulk edit existing slash commands. If a command does not exist, it will create it.
 *
 * **NOTE:** Any slash commands that are not specified in this function will be **deleted**. If you don't provide the commandId and rename your command, the command gets a new Id.
 */
export async function upsertSlashCommands(options: EditGlobalApplicationCommand[], guildId?: bigint) {
  options = validateSlashCommands(options);

  return await rest.runMethod<ApplicationCommand[]>(
    "put",
    guildId ? endpoints.COMMANDS_GUILD(applicationId, guildId) : endpoints.COMMANDS(applicationId),
    options
  );
}
