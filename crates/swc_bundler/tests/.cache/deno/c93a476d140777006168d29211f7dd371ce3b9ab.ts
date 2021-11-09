// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/emojis/create_guild_emoji.ts


/** https://discord.com/developers/docs/resources/emoji#create-guild-emoji */
export interface CreateGuildEmoji {
  /** Name of the emoji */
  name: string;
  /** The 128x128 emoji image */
  image: string;
  /** Roles allowed to use this emoji */
  roles: string[];
}
