// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/embeds/embed.ts


import { EmbedAuthor } from "./embed_author.ts";
import { EmbedField } from "./embed_field.ts";
import { EmbedFooter } from "./embed_footer.ts";
import { EmbedImage } from "./embed_image.ts";
import { EmbedProvider } from "./embed_provider.ts";
import { EmbedThumbnail } from "./embed_thumbnail.ts";
import { DiscordEmbedTypes } from "./embed_types.ts";
import { EmbedVideo } from "./embed_video.ts";

/** https://discord.com/developers/docs/resources/channel#embed-object */
export interface Embed {
  /** Title of embed */
  title?: string;
  /** Type of embed (always "rich" for webhook embeds) */
  type?: DiscordEmbedTypes;
  /** Description of embed */
  description?: string;
  /** Url of embed */
  url?: string;
  /** Timestamp of embed content */
  timestamp?: string;
  /** Color code of the embed */
  color?: number;
  /** Footer information */
  footer?: EmbedFooter;
  /** Image information */
  image?: EmbedImage;
  /** Thumbnail information */
  thumbnail?: EmbedThumbnail;
  /** Video information */
  video?: EmbedVideo;
  /** Provider information */
  provider?: EmbedProvider;
  /** Author information */
  author?: EmbedAuthor;
  /** Fields information */
  fields?: EmbedField[];
}
