// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_REACTION_ADD.ts


import { botId, eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { MessageReactionAdd } from "../../types/messages/message_reaction_add.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageReactionAdd(data: DiscordGatewayPayload) {
  const payload = data.d as MessageReactionAdd;
  const message = await cacheHandlers.get("messages", snowflakeToBigint(payload.messageId));

  if (message) {
    const reactionExisted = message.reactions?.find(
      (reaction) => reaction.emoji.id === payload.emoji.id && reaction.emoji.name === payload.emoji.name
    );

    if (reactionExisted) reactionExisted.count++;
    else {
      const newReaction = {
        count: 1,
        me: snowflakeToBigint(payload.userId) === botId,
        emoji: { ...payload.emoji, id: payload.emoji.id || undefined },
      };
      message.reactions = message.reactions ? [...message.reactions, newReaction] : [newReaction];
    }

    await cacheHandlers.set("messages", snowflakeToBigint(payload.messageId), message);
  }

  if (payload.member && payload.guildId) {
    const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
    if (guild) {
      const discordenoMember = await structures.createDiscordenoMember(payload.member, guild.id);
      await cacheHandlers.set("members", discordenoMember.id, discordenoMember);
    }
  }

  eventHandlers.reactionAdd?.(payload, message);
}
