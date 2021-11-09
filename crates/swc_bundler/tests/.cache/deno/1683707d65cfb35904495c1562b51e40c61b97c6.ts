// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/create_guild_role.ts


import { PermissionStrings } from "../permissions/permission_strings.ts";

export interface CreateGuildRole {
  /** Name of the role, default: "new role" */
  name?: string;
  /** Bitwise value of the enabled/disabled permissions, default: everyone permissions in guild */
  permissions?: PermissionStrings[];
  /** RGB color value, default: 0 */
  color?: number;
  /** Whether the role should be displayed separately in the sidebar, default: false */
  hoist?: boolean;
  /** Whether the role should be mentionable, default: false */
  mentionable?: boolean;
}

/** https://discord.com/developers/docs/resources/guild#create-guild-role */
export interface DiscordCreateGuildRole extends Omit<CreateGuildRole, "permissions"> {
  permissions?: string;
}
