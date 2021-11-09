// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/edit_webhook_with_token.ts


import { rest } from "../../rest/rest.ts";
import type { ModifyWebhook } from "../../types/webhooks/modify_webhook.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { endpoints } from "../../util/constants.ts";

/** Edit a webhook. Returns the updated webhook object on success. */
export async function editWebhookWithToken(
  webhookId: bigint,
  webhookToken: string,
  options: Omit<ModifyWebhook, "channelId">
) {
  return await rest.runMethod<Webhook>("patch", endpoints.WEBHOOK(webhookId, webhookToken), options);
}
