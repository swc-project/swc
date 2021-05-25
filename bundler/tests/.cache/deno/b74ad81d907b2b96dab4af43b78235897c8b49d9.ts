// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/attachment.ts


/** https://discord.com/developers/docs/resources/channel#attachment-object */
export interface Attachment {
  /** Attachment id */
  id: string;
  /** Name of file attached */
  filename: string;
  /** The attachment's [media type](https://en.wikipedia.org/wiki/Media_type) */
  contentType?: string;
  /** Size of file in bytes */
  size: number;
  /** Source url of file */
  url: string;
  /** A proxied url of file */
  proxyUrl: string;
  /** Height of file (if image) */
  height?: number | null;
  /** Width of file (if image) */
  width?: number | null;
}
