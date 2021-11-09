// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/remove_all_reactions.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Removes all reactions for all emojis on this message. */
export async function removeAllReactions(channelId: bigint, messageId: bigint) {
  await requireBotChannelPermissions(channelId, ["MANAGE_MESSAGES"]);

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_MESSAGE_REACTIONS(channelId, messageId));
}
