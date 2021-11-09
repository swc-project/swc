// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_sticker.ts


import { DiscordMessageStickerFormatTypes } from "./message_sticker_format_types.ts";

/** https://discord.com/developers/docs/resources/channel#message-object-message-sticker-structure */
export interface MessageSticker {
  /** id of the sticker */
  id: string;
  /** id of the pack the sticker is from */
  packId: string;
  /** Name of the sticker */
  name: string;
  /** Description of the sticker */
  description: string;
  /** A comma-separated list of tags for the sticker */
  tags?: string;
  /**
   * Sticker asset hash
   * Note: The URL for fetching sticker assets is currently private.
   */
  asset: string;
  /** Type of sticker format */
  formatType: DiscordMessageStickerFormatTypes;
}
