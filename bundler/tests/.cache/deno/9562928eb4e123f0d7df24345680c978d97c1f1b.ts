// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/start_typing.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { DiscordChannelTypes } from "../../types/channels/channel_types.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { botHasChannelPermissions } from "../../util/permissions.ts";

/**
 * Trigger a typing indicator for the specified channel. Generally bots should **NOT** implement this route.
 * However, if a bot is responding to a command and expects the computation to take a few seconds,
 * this endpoint may be called to let the user know that the bot is processing their message.
 */
export async function startTyping(channelId: bigint) {
  const channel = await cacheHandlers.get("channels", channelId);
  // If the channel is cached, we can do extra checks/safety
  if (channel) {
    if (
      ![
        DiscordChannelTypes.DM,
        DiscordChannelTypes.GuildNews,
        DiscordChannelTypes.GuildText,
        DiscordChannelTypes.GuildNewsThread,
        DiscordChannelTypes.GuildPivateThread,
        DiscordChannelTypes.GuildPublicThread,
      ].includes(channel.type)
    ) {
      throw new Error(Errors.CHANNEL_NOT_TEXT_BASED);
    }

    const hasSendMessagesPerm = await botHasChannelPermissions(channelId, ["SEND_MESSAGES"]);
    if (!hasSendMessagesPerm) {
      throw new Error(Errors.MISSING_SEND_MESSAGES);
    }
  }

  return await rest.runMethod<undefined>("post", endpoints.CHANNEL_TYPING(channelId));
}
