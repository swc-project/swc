// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { MessageDelete } from "../../types/messages/message_delete.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageDelete(data: DiscordGatewayPayload) {
  const payload = data.d as MessageDelete;
  const channel = await cacheHandlers.get("channels", snowflakeToBigint(payload.channelId));
  if (!channel) return;

  eventHandlers.messageDelete?.(
    { id: payload.id, channel },
    await cacheHandlers.get("messages", snowflakeToBigint(payload.id))
  );

  await cacheHandlers.delete("messages", snowflakeToBigint(payload.id));
}
