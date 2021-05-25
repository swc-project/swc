// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/channel_mention.ts


/** https://discord.com/developers/docs/resources/channel#channel-mention-object */
export interface ChannelMention {
  /** id of the channel */
  id: string;
  /** id of the guild containing the channel */
  guildId: string;
  /** The type of channel */
  type: number;
  /** The name of the channel */
  name: string;
}
