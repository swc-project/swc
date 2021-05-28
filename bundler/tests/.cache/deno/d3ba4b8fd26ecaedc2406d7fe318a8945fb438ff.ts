// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/channel.ts


import { User } from "../users/user.ts";
import { DiscordChannelTypes } from "./channel_types.ts";
import { DiscordOverwrite } from "./overwrite.ts";
import { ThreadMember } from "./threads/thread_member.ts";
import { ThreadMetadata } from "./threads/thread_metadata.ts";
import { DiscordVideoQualityModes } from "./video_quality_modes.ts";

/** https://discord.com/developers/docs/resources/channel#channel-object */
export interface Channel {
  /** The id of the channel */
  id: string;
  /** The type of channel */
  type: DiscordChannelTypes;
  /** The id of the guild */
  guildId?: string;
  /** Sorting position of the channel */
  position?: number;
  /** Explicit permission overwrites for members and roles */
  permissionOverwrites?: DiscordOverwrite[];
  /** The name of the channel (2-100 characters) */
  name?: string;
  /** The channel topic (0-1024 characters) */
  topic?: string | null;
  /** Whether the channel is nsfw */
  nsfw?: boolean;
  /** The id of the last message sent in this channel (may not point to an existing or valid message) */
  lastMessageId?: string | null;
  /** The bitrate (in bits) of the voice channel */
  bitrate?: number;
  /** The user limit of the voice channel */
  userLimit?: number;
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `manage_messages` or `manage_channel`, are unaffected */
  rateLimitPerUser?: number;
  /** The recipients of the DM */
  recipients?: User[];
  /** Icon hash */
  icon?: string | null;
  /** Id of the creator of the group DM or thread */
  ownerId?: string;
  /** Application id of the group DM creator if it is bot-created */
  applicationId?: string;
  /** For guild channels: Id of the parent category for a channel (each parent category can contain up to 50 channels), for threads: id of the text channel this thread was created */
  parentId?: string | null;
  /** When the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not pinned. */
  lastPinTimestamp?: string | null;
  /** Voice region id for the voice channel, automatic when set to null */
  rtcRegion?: string | null;
  /** The camera video quality mode of the voice channel, 1 when not present */
  videoQualityMode?: DiscordVideoQualityModes;
  // TODO(threads): consider a ThreadChannel object
  /** An approximate count of messages in a thread, stops counting at 50 */
  messageCount?: number;
  /** An approximate count of users in a thread, stops counting at 50 */
  memberCount?: number;
  /** Thread-specifig fields not needed by other channels */
  threadMetadata?: ThreadMetadata;
  /** Thread member object for the current user, if they have joined the thread, only included on certain API endpoints */
  member?: ThreadMember;
}
