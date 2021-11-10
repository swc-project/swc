// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/embeds/embed_field.ts


/** https://discord.com/developers/docs/resources/channel#embed-object-embed-field-structure */
export interface EmbedField {
  /** Name of the field */
  name: string;
  /** Value of the field */
  value: string;
  /** Whether or not this field should display inline */
  inline?: boolean;
}
