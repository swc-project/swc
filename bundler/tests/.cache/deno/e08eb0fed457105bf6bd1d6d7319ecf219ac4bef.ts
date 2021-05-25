// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/send_direct_message.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Channel } from "../../types/channels/channel.ts";
import type { CreateMessage } from "../../types/messages/create_message.ts";
import { endpoints } from "../../util/constants.ts";
import { sendMessage } from "../messages/send_message.ts";

/** Send a message to a users DM. Note: this takes 2 API calls. 1 is to fetch the users dm channel. 2 is to send a message to that channel. */
export async function sendDirectMessage(memberId: bigint, content: string | CreateMessage) {
  let dmChannel = await cacheHandlers.get("channels", memberId);
  if (!dmChannel) {
    // If not available in cache create a new one.
    const dmChannelData = await rest.runMethod<Channel>("post", endpoints.USER_DM, {
      recipient_id: memberId,
    });
    const discordenoChannel = await structures.createDiscordenoChannel(dmChannelData);
    // Recreate the channel and add it undert he users id
    await cacheHandlers.set("channels", memberId, discordenoChannel);
    dmChannel = discordenoChannel;
  }

  // If it does exist try sending a message to this user
  return await sendMessage(dmChannel.id, content);
}
