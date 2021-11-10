// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/create_webhook.ts


import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { CreateWebhook } from "../../types/webhooks/create_webhook.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";
import { urlToBase64 } from "../../util/utils.ts";
import { validateLength } from "../../util/validate_length.ts";

/**
 * Create a new webhook. Requires the MANAGE_WEBHOOKS permission. Returns a webhook object on success. Webhook names follow our naming restrictions that can be found in our Usernames and Nicknames documentation, with the following additional stipulations:
 *
 * Webhook names cannot be: 'clyde'
 */
export async function createWebhook(channelId: bigint, options: CreateWebhook) {
  await requireBotChannelPermissions(channelId, ["MANAGE_WEBHOOKS"]);

  if (
    // Specific usernames that discord does not allow
    options.name === "clyde" ||
    !validateLength(options.name, { min: 2, max: 32 })
  ) {
    throw new Error(Errors.INVALID_WEBHOOK_NAME);
  }

  return await rest.runMethod<Webhook>("post", endpoints.CHANNEL_WEBHOOKS(channelId), {
    ...options,
    avatar: options.avatar ? await urlToBase64(options.avatar) : undefined,
  });
}
