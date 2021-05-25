// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_widget_image_url.ts


import { cacheHandlers } from "../../cache.ts";
import type { GetGuildWidgetImageQuery } from "../../types/guilds/get_guild_widget_image.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the widget image URL for the guild. */
export async function getWidgetImageURL(guildId: bigint, options?: GetGuildWidgetImageQuery & { force?: boolean }) {
  if (!options?.force) {
    const guild = await cacheHandlers.get("guilds", guildId);
    if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);
    if (!guild.widgetEnabled) throw new Error(Errors.GUILD_WIDGET_NOT_ENABLED);
  }

  return `${endpoints.GUILD_WIDGET(guildId)}.png?style=${options?.style ?? "shield"}`;
}
