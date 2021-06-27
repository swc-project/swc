// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/embeds/embed_video.ts


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-video-structure */
export interface EmbedVideo {
  /** Source url of video */
  url?: string;
  /** A proxied url of the video */
  proxyUrl?: string;
  /** Height of video */
  height?: number;
  /** Width of video */
  width?: number;
}
