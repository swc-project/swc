// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/get_stage_instance.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { ChannelTypes } from "../../types/channels/channel_types.ts";
import type { StageInstance } from "../../types/channels/stage_instance.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";

/** Gets the stage instance associated with the Stage channel, if it exists. */
export async function getStageInstance(channelId: bigint) {
  const channel = await cacheHandlers.get("channels", channelId);

  if (channel) {
    if (channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error(Errors.CHANNEL_NOT_STAGE_VOICE);
    }
  }

  return await rest.runMethod<StageInstance>("get", endpoints.STAGE_INSTANCE(channelId));
}
