// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/templates/create_guild_from_template.ts


/** https://discord.com/developers/docs/resources/template#create-guild-from-template-json-params */
export interface CreateGuildFromTemplate {
  /** Name of the guild (2-100 characters) */
  name: string;
  /** base64 128x128 image for the guild icon */
  icon?: string;
}
