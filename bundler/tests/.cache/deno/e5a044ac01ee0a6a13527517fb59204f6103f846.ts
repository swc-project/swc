// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/emojis/delete_emoji.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Delete the given emoji. Requires the MANAGE_EMOJIS permission. Returns 204 No Content on success. */
export async function deleteEmoji(guildId: bigint, id: bigint, reason?: string) {
  await requireBotGuildPermissions(guildId, ["MANAGE_EMOJIS"]);

  return await rest.runMethod<undefined>("delete", endpoints.GUILD_EMOJI(guildId, id), { reason });
}
