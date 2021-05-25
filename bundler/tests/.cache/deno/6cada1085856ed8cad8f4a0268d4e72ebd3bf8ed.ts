// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/interactions/commands/delete_slash_response.ts


import { applicationId } from "../../../bot.ts";
import { rest } from "../../../rest/rest.ts";
import { endpoints } from "../../../util/constants.ts";

/** To delete your response to a slash command. If a message id is not provided, it will default to deleting the original response. */
export async function deleteSlashResponse(token: string, messageId?: bigint) {
  return await rest.runMethod<undefined>(
    "delete",
    messageId
      ? endpoints.INTERACTION_ID_TOKEN_MESSAGE_ID(applicationId, token, messageId)
      : endpoints.INTERACTION_ORIGINAL_ID_TOKEN(applicationId, token)
  );
}
