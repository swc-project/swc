// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/channel_pins_update.ts


/** https://discord.com/developers/docs/topics/gateway#channel-pins-update */
export interface ChannelPinsUpdate {
  /** The id of the guild */
  guildId?: string;
  /** The id of the channel */
  channelId: string;
  /** The time at which the most recent pinned message was pinned */
  lastPinTimestamp?: string | null;
}
