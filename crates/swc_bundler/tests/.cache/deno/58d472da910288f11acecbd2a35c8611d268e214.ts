// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/misc/USER_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { User } from "../../types/users/user.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleUserUpdate(data: DiscordGatewayPayload) {
  const userData = data.d as User;

  const member = await cacheHandlers.get("members", snowflakeToBigint(userData.id));
  if (!member) return;

  Object.entries(userData).forEach(([key, value]) => {
    eventHandlers.debug?.("loop", `Running forEach loop in USER_UPDATE file.`);
    // @ts-ignore index signatures
    if (member[key] !== value) return (member[key] = value);
  });

  await cacheHandlers.set("members", snowflakeToBigint(userData.id), member);

  eventHandlers.botUpdate?.(userData);
}
