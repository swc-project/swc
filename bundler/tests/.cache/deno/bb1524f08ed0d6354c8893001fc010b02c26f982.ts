// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/modify_channel.ts


import { SnakeCasedPropertiesDeep } from "../util.ts";
import { DiscordChannelTypes } from "./channel_types.ts";
import { DiscordOverwrite, Overwrite } from "./overwrite.ts";
import { DiscordVideoQualityModes } from "./video_quality_modes.ts";

export interface ModifyChannel {
  /** 2-100 character channel name */
  name?: string;
  /** The type of channel; only conversion between text and news is supported and only in guilds with the "NEWS" feature */
  type?: DiscordChannelTypes;
  /** The position of the channel in the left-hand listing */
  position?: number | null;
  /** 0-1024 character channel topic */
  topic?: string | null;
  /** Whether the channel is nsfw */
  nsfw?: boolean | null;
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected */
  rateLimitPerUser?: number | null;
  /** The bitrate (in bits) of the voice channel; 8000 to 96000 (128000 for VIP servers) */
  bitrate?: number | null;
  /** The user limit of the voice channel; 0 refers to no limit, 1 to 99 refers to a user limit */
  userLimit?: number | null;
  /** Channel or category-specific permissions */
  permissionOverwrites?: Overwrite[] | null;
  /** Id of the new parent category for a channel */
  parentId?: string | null;
  /** Voice region id for the voice channel, automatic when set to null */
  rtcRegion?: string | null;
  /** The camera video quality mode of the voice channel */
  videoQualityMode?: DiscordVideoQualityModes;
}

/** https://discord.com/developers/docs/resources/channel#modify-channel */
export interface DiscordModifyChannel extends SnakeCasedPropertiesDeep<Omit<ModifyChannel, "permissionOverwrites">> {
  // deno-lint-ignore camelcase
  permission_overwrites?: DiscordOverwrite[];
}
