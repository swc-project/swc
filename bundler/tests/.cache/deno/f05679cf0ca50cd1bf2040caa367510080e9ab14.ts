// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/swap_channels.ts


import { rest } from "../../rest/rest.ts";
import type { ModifyGuildChannelPositions } from "../../types/guilds/modify_guild_channel_position.ts";
import { endpoints } from "../../util/constants.ts";

/** Modify the positions of channels on the guild. Requires MANAGE_CHANNELS permisison. */
export async function swapChannels(guildId: bigint, channelPositions: ModifyGuildChannelPositions[]) {
  if (channelPositions.length < 2) {
    throw "You must provide at least two channels to be swapped.";
  }

  return await rest.runMethod<undefined>("patch", endpoints.GUILD_CHANNELS(guildId), channelPositions);
}
