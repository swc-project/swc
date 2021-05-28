// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/webhooks/webhooks_update.ts


/** https://discord.com/developers/docs/topics/gateway#webhooks-update-webhook-update-event-fields */
export interface WebhookUpdate {
  /** id of the guild */
  guildId: string;
  /** id of the channel */
  channelId: string;
}
