// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/THREAD_MEMBERS_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { ThreadMembersUpdate } from "../../types/channels/threads/thread_members_update.ts";
import { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleThreadMembersUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as ThreadMembersUpdate;
  const thread = await cacheHandlers.get("channels", snowflakeToBigint(payload.id));
  if (!thread) return;

  thread.memberCount = payload.memberCount;
  await cacheHandlers.set("channels", thread.id, thread);

  eventHandlers.threadMembersUpdate?.(payload);
}
