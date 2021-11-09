// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/batch_edit_slash_command_permissions.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import type { ApplicationCommandPermissions } from "../../../types/interactions/commands/application_command_permissions.ts";
import { endpoints } from "../../../util/constants.ts";
import { snakelize } from "../../../util/utils.ts";

/** Batch edits permissions for all commands in a guild. Takes an array of partial GuildApplicationCommandPermissions objects including `id` and `permissions`. */
export async function batchEditSlashCommandPermissions(
  guildId: bigint,
  options: { id: string; permissions: ApplicationCommandPermissions[] }[]
) {
  return await rest.runMethod("put", endpoints.COMMANDS_PERMISSIONS(applicationId, guildId), snakelize(options));
}
