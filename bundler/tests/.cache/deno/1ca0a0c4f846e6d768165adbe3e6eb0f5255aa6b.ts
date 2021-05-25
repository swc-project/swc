// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/integrations/INTEGRATION_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { IntegrationCreateUpdate } from "../../types/integrations/integration_create_update.ts";

export function handleIntegrationUpdate(data: DiscordGatewayPayload) {
  eventHandlers.integrationUpdate?.(data.d as IntegrationCreateUpdate);
}
