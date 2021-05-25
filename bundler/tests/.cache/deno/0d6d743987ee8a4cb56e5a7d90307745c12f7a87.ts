// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/embeds/embed_thumbnail.ts


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-thumbnail-structure */
export interface EmbedThumbnail {
  /** Source url of thumbnail (only supports http(s) and attachments) */
  url?: string;
  /** A proxied url of the thumbnail */
  proxyUrl?: string;
  /** Height of thumbnail */
  height?: number;
  /** Width of thumbnail */
  width?: number;
}
