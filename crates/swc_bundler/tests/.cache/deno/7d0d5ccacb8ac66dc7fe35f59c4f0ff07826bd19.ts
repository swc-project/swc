// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/embeds/embed_footer.ts


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-footer-structure */
export interface EmbedFooter {
  /** Footer text */
  text: string;
  /** Url of footer icon (only supports http(s) and attachments) */
  iconUrl?: string;
  /** A proxied url of footer icon */
  proxyIconUrl?: string;
}
