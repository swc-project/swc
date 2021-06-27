// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/integrations/INTEGRATION_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { IntegrationDelete } from "../../types/integrations/integration_delete.ts";

export function handleIntegrationDelete(data: DiscordGatewayPayload) {
  eventHandlers.integrationDelete?.(data.d as IntegrationDelete);
}
