// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/webhooks/discord_webhook_types.ts


/** https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-types */
export enum DiscordWebhookTypes {
  /** Incoming Webhooks can post messages to channels with a generated token */
  Incoming = 1,
  /** Channel Follower Webhooks are internal webhooks used with Channel Following to post new messages into channels */
  ChannelFollower,
  /** Application webhooks are webhooks used with Interactions */
  Application,
}

export type WebhookTypes = DiscordWebhookTypes;
export const WebhookTypes = DiscordWebhookTypes;
