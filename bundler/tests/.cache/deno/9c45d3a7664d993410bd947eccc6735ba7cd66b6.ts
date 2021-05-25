// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/remove_reaction.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Removes a reaction from the given user on this message, defaults to bot. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. */
export async function removeReaction(
  channelId: bigint,
  messageId: bigint,
  reaction: string,
  options?: { userId?: bigint }
) {
  if (options?.userId) {
    await requireBotChannelPermissions(channelId, ["MANAGE_MESSAGES"]);
  }

  if (reaction.startsWith("<:")) {
    reaction = reaction.substring(2, reaction.length - 1);
  } else if (reaction.startsWith("<a:")) {
    reaction = reaction.substring(3, reaction.length - 1);
  }

  return await rest.runMethod<undefined>(
    "delete",
    options?.userId
      ? endpoints.CHANNEL_MESSAGE_REACTION_USER(channelId, messageId, reaction, options.userId)
      : endpoints.CHANNEL_MESSAGE_REACTION_ME(channelId, messageId, reaction)
  );
}
