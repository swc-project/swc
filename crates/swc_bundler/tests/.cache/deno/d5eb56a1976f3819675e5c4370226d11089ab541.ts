// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/followed_channel.ts


/** https://discord.com/developers/docs/resources/channel#followed-channel-object */
export interface FollowedChannel {
  /** Source message id */
  channelId: string;
  /** Created target webhook id */
  webhookId: string;
}
