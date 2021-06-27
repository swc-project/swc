// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/messages/MESSAGE_CREATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildMemberWithUser } from "../../types/members/guild_member.ts";
import type { Message } from "../../types/messages/message.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleMessageCreate(data: DiscordGatewayPayload) {
  const payload = data.d as Message;
  const channel = await cacheHandlers.get("channels", snowflakeToBigint(payload.channelId));
  if (channel) channel.lastMessageId = snowflakeToBigint(payload.id);

  const guild = payload.guildId ? await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId)) : undefined;

  if (payload.member && guild) {
    // If in a guild cache the author as a member
    const discordenoMember = await structures.createDiscordenoMember(
      { ...payload.member, user: payload.author } as GuildMemberWithUser,
      guild.id
    );
    await cacheHandlers.set("members", discordenoMember.id, discordenoMember);
  }

  if (payload.mentions && guild) {
    await Promise.all(
      payload.mentions.map(async (mention) => {
        // Cache the member if its a valid member
        if (mention.member) {
          const discordenoMember = await structures.createDiscordenoMember(
            { ...mention.member, user: mention } as GuildMemberWithUser,
            guild.id
          );

          return cacheHandlers.set("members", snowflakeToBigint(mention.id), discordenoMember);
        }
      })
    );
  }

  const message = await structures.createDiscordenoMessage(data.d as Message);
  // Cache the message
  await cacheHandlers.set("messages", snowflakeToBigint(payload.id), message);

  eventHandlers.messageCreate?.(message);
}
