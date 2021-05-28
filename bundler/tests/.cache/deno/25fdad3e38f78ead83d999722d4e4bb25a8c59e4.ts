// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/webhooks/webhook.ts


import { Channel } from "../channels/channel.ts";
import { Guild } from "../guilds/guild.ts";
import { User } from "../users/user.ts";
import { DiscordWebhookTypes } from "./discord_webhook_types.ts";

/** https://discord.com/developers/docs/resources/webhook#webhook-object-webhook-structure */
export type Webhook = IncomingWebhook | ApplicationWebhook;

export interface IncomingWebhook {
  /** The id of the webhook */
  id: string;
  /** The type of the webhook */
  type: DiscordWebhookTypes;
  /** The guild id this webhook is for */
  guildId?: string;
  /** The channel id this webhook is for */
  channelId: string;
  /** The user this webhook was created by (not returned when getting a webhook with its token) */
  user?: User;
  /** The default name of the webhook */
  name: string | null;
  /** The default user avatar hash of the webhook */
  avatar: string | null;
  /** The secure token of the webhook (returned for Incomming Webhooks) */
  token?: string;
  /** The bot/OAuth2 application that created this webhook */
  applicationId: string | null;
  /** The guild of the channel that this webhook is following (returned for Channel Follower Webhooks) */
  sourceGuild?: Partial<Guild>;
  /** The channel that this webhook is following (returned for Channel Follower Webhooks) */
  sourceChannel?: Partial<Channel>;
  /** The url used for executing the webhook (returned by the webhooks OAuth2 flow) */
  url?: string;
}

export interface ApplicationWebhook extends Omit<IncomingWebhook, "type" | "guildId" | "channelId"> {
  type: DiscordWebhookTypes.Application;
  guildId?: string | null;
  channelId?: string | null;
}
