// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/create_guild_channel.ts


import { DiscordChannelTypes } from "../channels/channel_types.ts";
import { DiscordOverwrite, Overwrite } from "../channels/overwrite.ts";
import { SnakeCasedPropertiesDeep } from "../util.ts";

export interface CreateGuildChannel {
  /** Channel name (2-100 characters) */
  name: string;
  /** The type of channel */
  type?: DiscordChannelTypes;
  /** Channel topic (0-1024 characters) */
  topic?: string;
  /** The bitrate (in bits) of the voice channel (voice only) */
  bitrate?: number;
  /** The user limit of the voice channel (voice only) */
  userLimit?: number;
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected */
  rateLimitPerUser?: number;
  /** Sorting position of the channel */
  position?: number;
  /** The channel's permission overwrites */
  permissionOverwrites?: Overwrite[];
  /** Id of the parent category for a channel */
  parentId?: bigint;
  /** Whether the channel is nsfw */
  nsfw?: boolean;
}

/** https://discord.com/developers/docs/resources/guild#create-guild-channel */
export interface DiscordCreateGuildChannel
  extends SnakeCasedPropertiesDeep<Omit<CreateGuildChannel, "permissionOverwrites">> {
  // deno-lint-ignore camelcase
  permission_overwrites: DiscordOverwrite[];
}
