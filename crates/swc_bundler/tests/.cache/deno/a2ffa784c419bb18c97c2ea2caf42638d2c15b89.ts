// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_widget.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import type { GuildWidgetDetails } from "../../types/guilds/guild_widget_details.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the widget for the guild. */
export async function getWidget(guildId: bigint, options?: { force: boolean }) {
  if (!options?.force) {
    const guild = await cacheHandlers.get("guilds", guildId);
    if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);
    if (!guild?.widgetEnabled) throw new Error(Errors.GUILD_WIDGET_NOT_ENABLED);
  }

  return await rest.runMethod<GuildWidgetDetails>("get", `${endpoints.GUILD_WIDGET(guildId)}.json`);
}
