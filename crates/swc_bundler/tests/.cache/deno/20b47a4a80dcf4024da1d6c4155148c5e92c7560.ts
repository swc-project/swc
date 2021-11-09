// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/get_reactions.ts


import { rest } from "../../rest/rest.ts";
import type { GetReactions } from "../../types/messages/message_get_reactions.ts";
import type { User } from "../../types/users/user.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";

/** Get a list of users that reacted with this emoji. */
export async function getReactions(channelId: bigint, messageId: bigint, reaction: string, options?: GetReactions) {
  const users = await rest.runMethod<User[]>(
    "get",
    endpoints.CHANNEL_MESSAGE_REACTION(channelId, messageId, reaction),
    options
  );

  return new Collection(users.map((user) => [user.id, user]));
}
