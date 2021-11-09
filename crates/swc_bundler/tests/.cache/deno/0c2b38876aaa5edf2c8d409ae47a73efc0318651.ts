// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/edit_widget.ts


import { rest } from "../../rest/rest.ts";
import type { GuildWidget } from "../../types/guilds/guild_widget.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Modify a guild widget object for the guild. Requires the MANAGE_GUILD permission. */
export async function editWidget(guildId: bigint, enabled: boolean, channelId?: string | null) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<GuildWidget>("patch", endpoints.GUILD_WIDGET(guildId), {
    enabled,
    channel_id: channelId,
  });
}
