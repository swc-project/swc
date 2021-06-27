// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discovery/modify_guild_discovery_metadata.ts


// TODO: add docs link
export interface ModifyGuildDiscoveryMetadata {
  /** The id of the primary discovery category. Default: 0 */
  primaryCategoryId?: number | null;
  /** Up to 10 discovery search kekywords. Default: null */
  keywords?: string[] | null;
  /** Whether guild info is shown when custom emojis are clicked. Default: true */
  emojiDiscoverabilityEnabled?: boolean | null;
}
