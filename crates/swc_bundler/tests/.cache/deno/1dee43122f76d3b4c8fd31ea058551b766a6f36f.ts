// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/get_channel_webhooks.ts


import { rest } from "../../rest/rest.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Gets the webhooks for this channel. Requires MANAGE_WEBHOOKS */
export async function getChannelWebhooks(channelId: bigint) {
  await requireBotChannelPermissions(channelId, ["MANAGE_WEBHOOKS"]);

  const result = await rest.runMethod<Webhook[]>("get", endpoints.CHANNEL_WEBHOOKS(channelId));

  return new Collection(result.map((webhook) => [webhook.id, webhook]));
}
