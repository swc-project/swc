// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/delete_message.ts


import { botId } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";
import { delay } from "../../util/utils.ts";

/** Delete a message with the channel id and message id only. */
export async function deleteMessage(channelId: bigint, messageId: bigint, reason?: string, delayMilliseconds = 0) {
  const message = await cacheHandlers.get("messages", messageId);

  if (message && message.authorId !== botId) {
    await requireBotChannelPermissions(message.channelId, ["MANAGE_MESSAGES"]);
  }

  if (delayMilliseconds) await delay(delayMilliseconds);

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_MESSAGE(channelId, messageId), { reason });
}
