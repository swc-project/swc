// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discovery/discovery_metadata.ts


// TODO: add docs link
export interface DiscoveryMetadata {
  /** The guild Id */
  guildId: string;
  /** The id of the primary discovery category set for this guild */
  primaryCategoryId: number;
  /** Up to 10 discovery search keywords set for this guild */
  keywords: string[] | null;
  /** Whether guild info is shown when custom emojis from this guild are clicked */
  emojiDiscoverabilityEnabled: boolean;
  /** When the server's partner applicationo was accepted or denied, for applications via Server Settings */
  partnerActionedTimestamp: string | null;
  /** When the server applied for partnership, if it has a pending application */
  partnerApplicationTimestamp: string | null;
  /** Ids of up to 5 discovery subcategories set for this guild */
  categoryIds: number[];
}
