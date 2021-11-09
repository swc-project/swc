// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/get_messages.ts


import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import {
  GetMessagesAfter,
  GetMessagesAround,
  GetMessagesBefore,
  GetMessagesLimit,
} from "../../types/messages/get_messages.ts";
import type { Message } from "../../types/messages/message.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Fetches between 2-100 messages. Requires VIEW_CHANNEL and READ_MESSAGE_HISTORY */
export async function getMessages(
  channelId: bigint,
  options?: GetMessagesAfter | GetMessagesBefore | GetMessagesAround | GetMessagesLimit
) {
  await requireBotChannelPermissions(channelId, ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY"]);

  if (options?.limit && (options.limit < 0 || options.limit > 100)) {
    throw new Error(Errors.INVALID_GET_MESSAGES_LIMIT);
  }

  const result = await rest.runMethod<Message[]>("get", endpoints.CHANNEL_MESSAGES(channelId), options);

  return await Promise.all(result.map((res) => structures.createDiscordenoMessage(res)));
}
