// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/create_stage_instance.ts


import { validateLength } from "../../util/validate_length.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import type { StageInstance } from "../../types/channels/stage_instance.ts";
import { cacheHandlers } from "../../cache.ts";
import { ChannelTypes } from "../../types/channels/channel_types.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";
import { PrivacyLevel } from "../../types/channels/privacy_level.ts";
import { snakelize } from "../../util/utils.ts";

/** Creates a new Stage instance associated to a Stage channel. Requires the user to be a moderator of the Stage channel. */
export async function createStageInstance(channelId: bigint, topic: string, privacyLevel?: PrivacyLevel) {
  const channel = await cacheHandlers.get("channels", channelId);

  if (channel) {
    if (channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error(Errors.CHANNEL_NOT_STAGE_VOICE);
    }

    await requireBotChannelPermissions(channel, ["MANAGE_CHANNELS", "MUTE_MEMBERS", "MOVE_MEMBERS"]);
  }

  if (!validateLength(topic, { max: 120, min: 1 })) {
    throw new Error(Errors.INVALID_TOPIC_LENGTH);
  }

  return await rest.runMethod<StageInstance>(
    "post",
    endpoints.STAGE_INSTANCES,
    snakelize({
      channelId,
      topic,
      privacyLevel,
    })
  );
}
