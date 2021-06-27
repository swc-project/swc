// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/misc/TYPING_START.ts


import { eventHandlers } from "../../bot.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { TypingStart } from "../../types/misc/typing_start.ts";

export function handleTypingStart(data: DiscordGatewayPayload) {
  eventHandlers.typingStart?.(data.d as TypingStart);
}
