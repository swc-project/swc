// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/get_original_interaction_response.ts


import { applicationId } from "../../bot.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Message } from "../../types/messages/message.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the initial Interactio response. Functions the same as Get Webhook Message */
export async function getOriginalInteractionResponse(token: string) {
  const result = await rest.runMethod<Message>("get", endpoints.INTERACTION_ORIGINAL_ID_TOKEN(applicationId, token));

  return await structures.createDiscordenoMessage(result);
}
