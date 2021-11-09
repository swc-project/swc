// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_party.ts


/** https://discord.com/developers/docs/topics/gateway#activity-object-activity-party */
export interface ActivityParty {
  /** The id of the party */
  id?: string;
  /** Used to show the party's current and maximum size */
  size?: [currentSize: number, maxSize: number];
}
