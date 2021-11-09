// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/unpin_message.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Unpin a message in a channel. Requires MANAGE_MESSAGES. */
export async function unpin(channelId: bigint, messageId: bigint): Promise<undefined> {
  await requireBotChannelPermissions(channelId, ["MANAGE_MESSAGES"]);

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_PIN(channelId, messageId));
}

// aliases
export { unpin as unpinMessage };
