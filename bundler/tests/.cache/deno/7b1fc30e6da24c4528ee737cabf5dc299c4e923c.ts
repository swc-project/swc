// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_REACTION_REMOVE_ALL.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { MessageReactionRemoveAll } from "../../types/messages/message_reaction_remove_all.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageReactionRemoveAll(data: DiscordGatewayPayload) {
  const payload = data.d as MessageReactionRemoveAll;
  const message = await cacheHandlers.get("messages", snowflakeToBigint(payload.messageId));

  if (message?.reactions) {
    message.reactions = undefined;

    await cacheHandlers.set("messages", snowflakeToBigint(payload.messageId), message);
  }

  eventHandlers.reactionRemoveAll?.(payload, message);
}
