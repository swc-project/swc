// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_REACTION_REMOVE_EMOJI.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { MessageReactionRemoveEmoji } from "../../types/messages/message_reaction_remove_emoji.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageReactionRemoveEmoji(data: DiscordGatewayPayload) {
  const payload = data.d as MessageReactionRemoveEmoji;
  const message = await cacheHandlers.get("messages", snowflakeToBigint(payload.messageId));

  if (message?.reactions) {
    message.reactions = message.reactions.filter(
      (reaction) =>
        !(
          // MUST USE == because discord sends null and we use undefined
          (reaction.emoji.id == payload.emoji.id && reaction.emoji.name === payload.emoji.name)
        )
    );

    if (!message.reactions.length) message.reactions = undefined;

    await cacheHandlers.set("messages", message.id, message);
  }

  eventHandlers.reactionRemoveEmoji?.(
    payload.emoji,
    snowflakeToBigint(payload.messageId),
    snowflakeToBigint(payload.channelId),
    payload.guildId ? snowflakeToBigint(payload.guildId) : undefined
  );
}
