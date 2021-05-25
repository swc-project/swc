// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/remove_reaction_emoji.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Removes all reactions for a single emoji on this message. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. */
export async function removeReactionEmoji(channelId: bigint, messageId: bigint, reaction: string) {
  await requireBotChannelPermissions(channelId, ["MANAGE_MESSAGES"]);

  if (reaction.startsWith("<:")) {
    reaction = reaction.substring(2, reaction.length - 1);
  } else if (reaction.startsWith("<a:")) {
    reaction = reaction.substring(3, reaction.length - 1);
  }

  return await rest.runMethod<undefined>("delete", endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, reaction));
}
