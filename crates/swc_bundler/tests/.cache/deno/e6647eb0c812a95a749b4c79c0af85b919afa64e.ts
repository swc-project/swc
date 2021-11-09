// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/channels/STAGE_INSTANCE_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import type { StageInstance } from "../../types/channels/stage_instance.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";

export function handleStageInstanceDelete(data: DiscordGatewayPayload) {
  eventHandlers.stageInstanceDelete?.(data.d as StageInstance);
}
