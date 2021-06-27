// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/update_stage_instance.ts


import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { StageInstance } from "../../types/channels/stage_instance.ts";
import { endpoints } from "../../util/constants.ts";
import { validateLength } from "../../util/validate_length.ts";
import { cacheHandlers } from "../../cache.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";
import { ChannelTypes } from "../../types/channels/channel_types.ts";
import { snakelize } from "../../util/utils.ts";

/** Updates fields of an existing Stage instance. Requires the user to be a moderator of the Stage channel. */
export async function updateStageInstance(
  channelId: bigint,
  data: Partial<Pick<StageInstance, "topic" | "privacyLevel">> = {}
) {
  const channel = await cacheHandlers.get("channels", channelId);

  if (channel) {
    if (channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error(Errors.CHANNEL_NOT_STAGE_VOICE);
    }

    await requireBotChannelPermissions(channel, ["MOVE_MEMBERS", "MUTE_MEMBERS", "MANAGE_CHANNELS"]);
  }

  if (
    data?.topic &&
    !validateLength(data.topic, {
      min: 1,
      max: 120,
    })
  ) {
    throw new Error(Errors.INVALID_TOPIC_LENGTH);
  }

  return await rest.runMethod<StageInstance>("patch", endpoints.STAGE_INSTANCE(channelId), snakelize(data));
}
