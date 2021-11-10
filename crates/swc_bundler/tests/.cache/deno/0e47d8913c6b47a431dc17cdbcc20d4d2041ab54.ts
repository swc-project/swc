// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_widget_settings.ts


import { rest } from "../../rest/rest.ts";
import type { GuildWidget } from "../../types/guilds/guild_widget.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Returns the guild widget object. Requires the MANAGE_GUILD permission. */
export async function getWidgetSettings(guildId: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<GuildWidget>("get", endpoints.GUILD_WIDGET(guildId));
}
