// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/unavailable_guild.ts


import { Guild } from "./guild.ts";

/** https://discord.com/developers/docs/resources/guild#unavailable-guild-object */
export type UnavailableGuild = Pick<Guild, "id" | "unavailable">;
