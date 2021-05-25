// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_timestamps.ts


/** https://discord.com/developers/docs/topics/gateway#activity-object-activity-timestamps */
export interface ActivityTimestamps {
  /** Unix time (in milliseconds) of when the activity started */
  start?: number;
  /** Unix time (in milliseconds) of when the activity ends */
  end?: number;
}
