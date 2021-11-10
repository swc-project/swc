// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/delete_webhook_message.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";

export async function deleteWebhookMessage(webhookId: bigint, webhookToken: string, messageId: bigint) {
  return await rest.runMethod<undefined>("delete", endpoints.WEBHOOK_MESSAGE(webhookId, webhookToken, messageId));
}
