// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discordeno/guild_update_change.ts


import { Guild } from "../guilds/guild.ts";

export interface GuildUpdateChange {
  key: keyof Guild;
  oldValue?: unknown;
  value?: unknown;
}
