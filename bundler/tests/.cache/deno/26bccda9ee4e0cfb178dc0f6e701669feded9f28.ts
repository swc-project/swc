// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/follow_channel.ts


import { rest } from "../../rest/rest.ts";
import type { FollowedChannel } from "../../types/channels/followed_channel.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Follow a News Channel to send messages to a target channel. Requires the `MANAGE_WEBHOOKS` permission in the target channel. Returns the webhook id. */
export async function followChannel(sourceChannelId: bigint, targetChannelId: bigint) {
  await requireBotChannelPermissions(targetChannelId, ["MANAGE_WEBHOOKS"]);

  const data = await rest.runMethod<FollowedChannel>("post", endpoints.CHANNEL_FOLLOW(sourceChannelId), {
    webhook_channel_id: targetChannelId,
  });

  return data.webhookId;
}
