// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/discovery/get_discovery_categories.ts


import { rest } from "../../rest/rest.ts";
import type { DiscoveryCategory } from "../../types/discovery/discovery_category.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns a Collection (mapped by Id of the discovery category object) of discovery category objects that can be used when editing guilds */
export async function getDiscoveryCategories() {
  const result = await rest.runMethod<DiscoveryCategory[]>("get", endpoints.DISCOVERY_CATEGORIES);

  return new Collection<number, DiscoveryCategory>(result.map((category) => [category.id, category]));
}
