// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_DELETE_BULK.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { MessageDeleteBulk } from "../../types/messages/message_delete_bulk.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageDeleteBulk(data: DiscordGatewayPayload) {
  const payload = data.d as MessageDeleteBulk;
  const channel = await cacheHandlers.get("channels", snowflakeToBigint(payload.channelId));
  if (!channel) return;

  return Promise.all(
    payload.ids.map(async (id) => {
      eventHandlers.messageDelete?.({ id, channel }, await cacheHandlers.get("messages", snowflakeToBigint(id)));
      await cacheHandlers.delete("messages", snowflakeToBigint(id));
    })
  );
}
