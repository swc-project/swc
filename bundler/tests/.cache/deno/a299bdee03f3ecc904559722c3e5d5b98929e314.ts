// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/THREAD_LIST_SYNC.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { DiscordenoChannel } from "../../structures/channel.ts";
import { structures } from "../../structures/mod.ts";
import { ThreadListSync } from "../../types/channels/threads/thread_list_sync.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { Collection } from "../../util/collection.ts";

export async function handleThreadListSync(data: DiscordGatewayPayload) {
  const payload = data.d as ThreadListSync;

  const discordenoChannels = await Promise.all(
    payload.threads.map(async (thread) => {
      const discordenoChannel = await structures.createDiscordenoChannel(thread, snowflakeToBigint(payload.guildId));

      await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);

      return discordenoChannel;
    })
  );

  const threads = new Collection<bigint, DiscordenoChannel>(discordenoChannels.map((t) => [t.id, t]));

  eventHandlers.threadListSync?.(threads, payload.members, snowflakeToBigint(payload.guildId));
}
