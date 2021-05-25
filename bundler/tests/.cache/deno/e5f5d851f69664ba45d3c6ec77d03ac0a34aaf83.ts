// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/get_message.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Message } from "../../types/messages/message.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Fetch a single message from the server. Requires VIEW_CHANNEL and READ_MESSAGE_HISTORY */
export async function getMessage(channelId: bigint, id: bigint) {
  if (await cacheHandlers.has("channels", channelId)) {
    await requireBotChannelPermissions(channelId, ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]);
  }

  const result = await rest.runMethod<Message>("get", endpoints.CHANNEL_MESSAGE(channelId, id));

  return await structures.createDiscordenoMessage(result);
}
