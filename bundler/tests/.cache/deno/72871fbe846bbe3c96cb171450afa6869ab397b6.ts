// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/get_slash_command.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import type { ApplicationCommand } from "../../../types/interactions/commands/application_command.ts";
import { snowflakeToBigint } from "../../../util/bigint.ts";
import { endpoints } from "../../../util/constants.ts";

/** Fetchs the global command for the given Id. If a guildId is provided, the guild command will be fetched. */
export async function getSlashCommand(commandId: bigint, guildId?: bigint) {
  const result = await rest.runMethod<ApplicationCommand>(
    "get",
    guildId
      ? endpoints.COMMANDS_GUILD_ID(applicationId, guildId, commandId)
      : endpoints.COMMANDS_ID(applicationId, commandId)
  );

  return {
    ...result,
    id: snowflakeToBigint(result.id),
    applicationId: snowflakeToBigint(result.applicationId),
  };
}
