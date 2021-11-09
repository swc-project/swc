// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/activity_assets.ts


/** https://discord.com/developers/docs/topics/gateway#activity-object-activity-assets */
export interface ActivityAssets {
  /** The id for a large asset of the activity, usually a snowflake */
  largeImage?: string;
  /** Text displayed when hovering over the large image of the activity */
  largeText?: string;
  /** The id for a small asset of the activity, usually a snowflake */
  smallImage?: string;
  /** Text displayed when hovering over the small image of the activity */
  smallText?: string;
}
