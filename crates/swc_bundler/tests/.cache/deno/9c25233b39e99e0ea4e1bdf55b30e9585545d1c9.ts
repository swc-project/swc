// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/messages/publish_message.ts


import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Message } from "../../types/messages/message.ts";
import { endpoints } from "../../util/constants.ts";

/** Crosspost a message in a News Channel to following channels. */
export async function publishMessage(channelId: bigint, messageId: bigint) {
  const data = await rest.runMethod<Message>("post", endpoints.CHANNEL_MESSAGE_CROSSPOST(channelId, messageId));

  return await structures.createDiscordenoMessage(data);
}
