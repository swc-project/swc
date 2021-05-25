// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/get_webhook_with_token.ts


import { rest } from "../../rest/rest.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the new webhook object for the given id, this call does not require authentication and returns no user in the webhook object. */
export async function getWebhookWithToken(webhookId: bigint, token: string) {
  return await rest.runMethod<Webhook>("get", endpoints.WEBHOOK(webhookId, token));
}
