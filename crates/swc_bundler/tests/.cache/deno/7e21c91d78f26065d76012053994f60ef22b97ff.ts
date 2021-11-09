// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_types.ts


/** https://discord.com/developers/docs/topics/gateway#activity-object-activity-types */
export enum DiscordActivityTypes {
  Game,
  Streaming,
  Listening,
  Watching,
  Custom = 4,
  Competing,
}

export type ActivityTypes = DiscordActivityTypes;
export const ActivityTypes = DiscordActivityTypes;
