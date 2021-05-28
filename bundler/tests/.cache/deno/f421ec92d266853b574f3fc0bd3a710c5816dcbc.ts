// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/get_webhook.ts


import { rest } from "../../rest/rest.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the new webhook object for the given id. */
export async function getWebhook(webhookId: bigint) {
  return await rest.runMethod<Webhook>("get", endpoints.WEBHOOK_ID(webhookId));
}
