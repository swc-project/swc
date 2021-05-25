// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/get_slash_command_permission.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import type { GuildApplicationCommandPermissions } from "../../../types/interactions/commands/guild_application_command_permissions.ts";
import { endpoints } from "../../../util/constants.ts";

/** Fetches command permissions for a specific command for your application in a guild. Returns a GuildApplicationCommandPermissions object. */
export async function getSlashCommandPermission(guildId: bigint, commandId: bigint) {
  return await rest.runMethod<GuildApplicationCommandPermissions>(
    "get",
    endpoints.COMMANDS_PERMISSION(applicationId, guildId, commandId)
  );
}
