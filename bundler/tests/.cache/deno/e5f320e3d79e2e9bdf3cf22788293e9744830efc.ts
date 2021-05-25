// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/integrations/integration_expire_behaviors.ts


/** https://discord.com/developers/docs/resources/guild#integration-object-integration-expire-behaviors */
export enum DiscordIntegrationExpireBehaviors {
  RemoveRole,
  Kick,
}

export type IntegrationExpireBehaviors = DiscordIntegrationExpireBehaviors;
export const IntegrationExpireBehaviors = DiscordIntegrationExpireBehaviors;
