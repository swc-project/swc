// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/delete_webhook_with_token.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";

/** Delete a webhook permanently. Returns a undefined on success */
export async function deleteWebhookWithToken(webhookId: bigint, webhookToken: string) {
  return await rest.runMethod<undefined>("delete", endpoints.WEBHOOK(webhookId, webhookToken));
}
