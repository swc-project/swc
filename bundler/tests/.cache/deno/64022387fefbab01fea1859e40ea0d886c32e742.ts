// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/webhooks/modify_webhook.ts


/** https://discord.com/developers/docs/resources/webhook#modify-webhook-json-params */
export interface ModifyWebhook {
  /** The default name of the webhook */
  name?: string;
  /** Image for the default webhook avatar */
  avatar?: string | null;
  /** The new channel id this webhook should be moved to */
  channelId?: string;
}
