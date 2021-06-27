// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/get_guild_widget_image.ts


import { DiscordGetGuildWidgetImageStyleOptions } from "./get_guild_widget_image_style_options.ts";

/** https://discord.com/developers/docs/resources/guild#get-guild-widget-image-query-string-params */
export interface GetGuildWidgetImageQuery {
  /** Style of the widget returned, default: shield */
  style?: DiscordGetGuildWidgetImageStyleOptions;
}
