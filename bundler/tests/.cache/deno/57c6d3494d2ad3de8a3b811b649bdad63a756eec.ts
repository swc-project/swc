// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/add_reactions.ts


import { eventHandlers } from "../../bot.ts";
import { addReaction } from "./add_reaction.ts";

/** Adds multiple reactions to a message. If `ordered` is true(default is false), it will add the reactions one at a time in the order provided. Note: Reaction takes the form of **name:id** for custom guild emoji, or Unicode characters. Requires READ_MESSAGE_HISTORY and ADD_REACTIONS */
export async function addReactions(channelId: bigint, messageId: bigint, reactions: string[], ordered = false) {
  if (!ordered) {
    await Promise.all(reactions.map((reaction) => addReaction(channelId, messageId, reaction)));
  } else {
    for (const reaction of reactions) {
      eventHandlers.debug?.("loop", "Running for of loop in addReactions function.");
      await addReaction(channelId, messageId, reaction);
    }
  }
}
