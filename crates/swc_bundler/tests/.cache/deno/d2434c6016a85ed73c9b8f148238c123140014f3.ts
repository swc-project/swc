// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/integrations/integration_create_update.ts


import { Integration } from "./integration.ts";

/** https://github.com/discord/discord-api-docs/blob/master/docs/topics/Gateway.md#integration-create-event-additional-fields */
export interface IntegrationCreateUpdate extends Integration {
  /** Id of the guild */
  guildId: string;
}
