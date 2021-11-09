// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_widget.ts


/** https://discord.com/developers/docs/resources/guild#guild-widget-object-guild-widget-structure */
export interface GuildWidget {
  /** Whether the widget is enabled */
  enabled: boolean;
  /** The widget channel id */
  channelId: string | null;
}
