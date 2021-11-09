// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/update_voice_state.ts


import { rest } from "../../rest/rest.ts";
import { UpdateOthersVoiceState } from "../../types/guilds/update_others_voice_state.ts";
import type { UpdateSelfVoiceState } from "../../types/guilds/update_self_voice_state.ts";
import { endpoints } from "../../util/constants.ts";
import { hasOwnProperty, snakelize } from "../../util/utils.ts";

/**
 * Updates the a user's voice state, defaults to the current user
 * Caveats:
 *  - `channel_id` must currently point to a stage channel.
 *  - User must already have joined `channel_id`.
 *  - You must have the `MUTE_MEMBERS` permission. But can always suppress yourself.
 *  - When unsuppressed, non-bot users will have their `request_to_speak_timestamp` set to the current time. Bot users will not.
 *  - You must have the `REQUEST_TO_SPEAK` permission to request to speak. You can always clear your own request to speak.
 *  - You are able to set `request_to_speak_timestamp` to any present or future time.
 *  - When suppressed, the user will have their `request_to_speak_timestamp` removed.
 */
export async function updateBotVoiceState(
  guildId: bigint,
  options: UpdateSelfVoiceState | ({ userId: bigint } & UpdateOthersVoiceState)
) {
  return await rest.runMethod(
    "patch",
    endpoints.UPDATE_VOICE_STATE(guildId, hasOwnProperty(options, "userId") ? options.userId : undefined),
    snakelize(options)
  );
}
