// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { Message } from "../../types/messages/message.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as Message;
  const channel = await cacheHandlers.get("channels", snowflakeToBigint(payload.channelId));
  if (!channel) return;

  const oldMessage = await cacheHandlers.get("messages", snowflakeToBigint(payload.id));
  if (!oldMessage) return;

  // Messages with embeds can trigger update but they wont have edited_timestamp
  if (!payload.editedTimestamp || oldMessage.content === payload.content) {
    return;
  }

  const message = await structures.createDiscordenoMessage(payload);

  await cacheHandlers.set("messages", snowflakeToBigint(payload.id), message);

  eventHandlers.messageUpdate?.(message, oldMessage);
}
