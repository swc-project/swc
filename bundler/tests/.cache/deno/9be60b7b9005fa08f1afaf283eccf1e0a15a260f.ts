// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/edit_webhook.ts


import { rest } from "../../rest/rest.ts";
import type { ModifyWebhook } from "../../types/webhooks/modify_webhook.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Edit a webhook. Requires the `MANAGE_WEBHOOKS` permission. Returns the updated webhook object on success. */
export async function editWebhook(channelId: bigint, webhookId: bigint, options: ModifyWebhook) {
  await requireBotChannelPermissions(channelId, ["MANAGE_WEBHOOKS"]);

  return await rest.runMethod<Webhook>("patch", endpoints.WEBHOOK_ID(webhookId), {
    ...options,
    channel_id: options.channelId,
  });
}
