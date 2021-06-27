// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discovery/discovery_category.ts


import { DiscoveryName } from "./discovery_name.ts";

//TODO: add docs link
export interface DiscoveryCategory {
  /** Numeric id of the category */
  id: number;
  /** The name of this category, in mutliple languages */
  name: DiscoveryName;
  /** Whether this category can be set as a guild's primary category */
  isPrimary: boolean;
}
