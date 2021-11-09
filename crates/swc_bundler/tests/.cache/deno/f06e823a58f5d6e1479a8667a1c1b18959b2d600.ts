// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/misc/PRESENCE_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { PresenceUpdate } from "../../types/activity/presence_update.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handlePresenceUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as PresenceUpdate;

  const oldPresence = await cacheHandlers.get("presences", snowflakeToBigint(payload.user.id));
  await cacheHandlers.set("presences", snowflakeToBigint(payload.user.id), payload);

  eventHandlers.presenceUpdate?.(payload, oldPresence);
}
