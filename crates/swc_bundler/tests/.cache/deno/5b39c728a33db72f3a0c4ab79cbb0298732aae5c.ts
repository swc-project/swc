// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/category_children.ts


import { cacheHandlers } from "../../cache.ts";

/** Gets an array of all the channels ids that are the children of this category. */
export async function categoryChildren(id: bigint) {
  return await cacheHandlers.filter("channels", (channel) => channel.parentId === id);
}
