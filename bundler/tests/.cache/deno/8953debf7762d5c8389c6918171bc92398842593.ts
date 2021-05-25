// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/edit_channel_overwrite.ts


import { rest } from "../../rest/rest.ts";
import type { Overwrite } from "../../types/channels/overwrite.ts";
import { endpoints } from "../../util/constants.ts";
import { calculateBits, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Edit the channel permission overwrites for a user or role in this channel. Requires `MANAGE_ROLES` permission. */
export async function editChannelOverwrite(
  guildId: bigint,
  channelId: bigint,
  overwriteId: bigint,
  options: Omit<Overwrite, "id">
): Promise<undefined> {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  return await rest.runMethod<undefined>("put", endpoints.CHANNEL_OVERWRITE(channelId, overwriteId), {
    allow: calculateBits(options.allow),
    deny: calculateBits(options.deny),
    type: options.type,
  });
}
