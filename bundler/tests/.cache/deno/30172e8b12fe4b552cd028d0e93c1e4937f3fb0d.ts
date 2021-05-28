// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/delete_stage_instance.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { ChannelTypes } from "../../types/channels/channel_types.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Deletes the Stage instance. Requires the user to be a moderator of the Stage channel. */
export async function deleteStageInstance(channelId: bigint) {
  const channel = await cacheHandlers.get("channels", channelId);

  if (channel) {
    if (channel.type !== ChannelTypes.GuildStageVoice) {
      throw new Error(Errors.CHANNEL_NOT_STAGE_VOICE);
    }

    await requireBotChannelPermissions(channel, ["MUTE_MEMBERS", "MANAGE_CHANNELS", "MOVE_MEMBERS"]);
  }

  return await rest.runMethod<undefined>("delete", endpoints.STAGE_INSTANCE(channelId));
}
