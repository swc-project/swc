// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/delete_channel_overwrite.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Delete the channel permission overwrites for a user or role in this channel. Requires `MANAGE_ROLES` permission. */
export async function deleteChannelOverwrite(
  guildId: bigint,
  channelId: bigint,
  overwriteId: bigint
): Promise<undefined> {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_OVERWRITE(channelId, overwriteId));
}
