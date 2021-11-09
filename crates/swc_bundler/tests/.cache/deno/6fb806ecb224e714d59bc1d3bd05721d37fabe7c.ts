// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_secrets.ts


/** https://discord.com/developers/docs/topics/gateway#activity-object-activity-secrets */
export interface ActivitySecrets {
  /** The secret for joining a party */
  join?: string;
  /** The secret for spectating a game */
  spectate?: string;
  /** The secret for a specific instanced match */
  match?: string;
}
