// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/delete_slash_command.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import { endpoints } from "../../../util/constants.ts";

/** Deletes a slash command. */
export async function deleteSlashCommand(id: bigint, guildId?: bigint) {
  return await rest.runMethod<undefined>(
    "delete",
    guildId ? endpoints.COMMANDS_GUILD_ID(applicationId, guildId, id) : endpoints.COMMANDS_ID(applicationId, id)
  );
}
