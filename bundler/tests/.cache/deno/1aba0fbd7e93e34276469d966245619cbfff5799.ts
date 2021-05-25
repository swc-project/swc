// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/templates/modify_guild_template.ts


/** https://discord.com/developers/docs/resources/template#modify-guild-template */
export interface ModifyGuildTemplate {
  /** Name of the template (1-100 characters) */
  name?: string;
  /** Description of the template (0-120 characters) */
  description?: string | null;
}
