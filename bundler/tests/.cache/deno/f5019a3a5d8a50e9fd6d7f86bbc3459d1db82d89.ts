// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/emojis/emoji_url.ts


/** Creates a url to the emoji from the Discord CDN. */
export function emojiURL(id: bigint, animated = false) {
  return `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
}
