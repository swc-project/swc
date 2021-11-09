// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/add_reaction.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Create a reaction for the message. Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. Requires READ_MESSAGE_HISTORY and ADD_REACTIONS */
export async function addReaction(channelId: bigint, messageId: bigint, reaction: string) {
  await requireBotChannelPermissions(channelId, ["ADD_REACTIONS", "READ_MESSAGE_HISTORY"]);

  if (reaction.startsWith("<:")) {
    reaction = reaction.substring(2, reaction.length - 1);
  } else if (reaction.startsWith("<a:")) {
    reaction = reaction.substring(3, reaction.length - 1);
  }

  return await rest.runMethod<undefined>("put", endpoints.CHANNEL_MESSAGE_REACTION_ME(channelId, messageId, reaction));
}
