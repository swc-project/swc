// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity.ts


import { ActivityAssets } from "./activity_assets.ts";
import { ActivityButton } from "./activity_button.ts";
import { ActivityEmoji } from "./activity_emoji.ts";
import { ActivityParty } from "./activity_party.ts";
import { ActivitySecrets } from "./activity_secrets.ts";
import { ActivityTimestamps } from "./activity_timestamps.ts";
import { DiscordActivityTypes } from "./activity_types.ts";

/** https://discord.com/developers/docs/topics/gateway#activity-object */
export interface Activity {
  /** The activity's name */
  name: string;
  /** Activity type */
  type: DiscordActivityTypes;
  /** Stream url, is validated when type is 1 */
  url?: string | null;
  /** Unix timestamp of when the activity was added to the user's session */
  createdAt: number;
  /** Unix timestamps for start and/or end of the game */
  timestamps?: ActivityTimestamps;
  /** Application id for the game */
  applicationId?: string;
  /** What the player is currently doing */
  details?: string | null;
  /** The user's current party status */
  state?: string | null;
  /** The emoji used for a custom status */
  emoji?: ActivityEmoji | null;
  /** Information for the current party of the player */
  party?: ActivityParty;
  /** Images for the presence and their hover texts */
  assets?: ActivityAssets;
  /** Secrets for Rich Presence joining and spectating */
  secrets?: ActivitySecrets;
  /** Whether or not the activity is an instanced game session */
  instance?: boolean;
  /** Activity flags `OR`d together, describes what the payload includes */
  flags?: number;
  /** The custom buttons shown in the Rich Presence (max 2) */
  buttons?: ActivityButton[];
}
