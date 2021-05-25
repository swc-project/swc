// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/send_webhook.ts


import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { DiscordAllowedMentionsTypes } from "../../types/messages/allowed_mentions_types.ts";
import type { Message } from "../../types/messages/message.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { ExecuteWebhook } from "../../types/webhooks/execute_webhook.ts";
import { endpoints } from "../../util/constants.ts";

/** Send a webhook with webhook Id and webhook token */
export async function sendWebhook(webhookId: bigint, webhookToken: string, options: ExecuteWebhook) {
  if (!options.content && !options.file && !options.embeds) {
    throw new Error(Errors.INVALID_WEBHOOK_OPTIONS);
  }

  if (options.content && options.content.length > 2000) {
    throw Error(Errors.MESSAGE_MAX_LENGTH);
  }

  if (options.embeds && options.embeds.length > 10) {
    options.embeds.splice(10);
  }

  if (options.allowedMentions) {
    if (options.allowedMentions.users?.length) {
      if (options.allowedMentions.parse?.includes(DiscordAllowedMentionsTypes.UserMentions)) {
        options.allowedMentions.parse = options.allowedMentions.parse.filter((p) => p !== "users");
      }

      if (options.allowedMentions.users.length > 100) {
        options.allowedMentions.users = options.allowedMentions.users.slice(0, 100);
      }
    }

    if (options.allowedMentions.roles?.length) {
      if (options.allowedMentions.parse?.includes(DiscordAllowedMentionsTypes.RoleMentions)) {
        options.allowedMentions.parse = options.allowedMentions.parse.filter((p) => p !== "roles");
      }

      if (options.allowedMentions.roles.length > 100) {
        options.allowedMentions.roles = options.allowedMentions.roles.slice(0, 100);
      }
    }
  }

  const result = await rest.runMethod<Message>(
    "post",
    `${endpoints.WEBHOOK(webhookId, webhookToken)}?wait=${options.wait ?? false}${
      options.threadId ? `&thread_id=${options.threadId}` : ""
    }`,
    {
      ...options,
      allowed_mentions: options.allowedMentions,
      avatar_url: options.avatarUrl,
    }
  );
  if (!options.wait) return;

  return structures.createDiscordenoMessage(result);
}
