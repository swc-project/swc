// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/ban.ts


import { User } from "../users/user.ts";

/** https://discord.com/developers/docs/resources/guild#ban-object */
export interface Ban {
  /** The reason for the ban */
  reason: string | null;
  /** The banned user */
  user: User;
}
