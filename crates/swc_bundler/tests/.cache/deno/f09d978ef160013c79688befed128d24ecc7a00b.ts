// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/emojis/modify_guild_emoji.ts


/** https://discord.com/developers/docs/resources/emoji#modify-guild-emoji */
export interface ModifyGuildEmoji {
  /** Name of the emoji */
  name?: string;
  /** Roles allowed to use this emoji */
  roles?: string[] | null;
}
