// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/edit_message.ts


import { botId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { DiscordenoMessage } from "../../structures/message.ts";
import { structures } from "../../structures/mod.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { EditMessage } from "../../types/messages/edit_message.ts";
import type { Message } from "../../types/messages/message.ts";
import type { PermissionStrings } from "../../types/permissions/permission_strings.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";
import { validateComponents } from "../../util/utils.ts";

/** Edit the message. */
export async function editMessage(message: DiscordenoMessage, content: string | EditMessage) {
  if (message.authorId !== botId) {
    throw "You can only edit a message that was sent by the bot.";
  }

  if (typeof content === "string") content = { content };

  if (content.components?.length) {
    validateComponents(content.components);
  }

  const requiredPerms: PermissionStrings[] = ["SEND_MESSAGES"];

  await requireBotChannelPermissions(message.channelId, requiredPerms);

  if (content.content && content.content.length > 2000) {
    throw new Error(Errors.MESSAGE_MAX_LENGTH);
  }

  const result = await rest.runMethod<Message>(
    "patch",
    endpoints.CHANNEL_MESSAGE(message.channelId, message.id),
    content
  );

  return await structures.createDiscordenoMessage(result);
}
