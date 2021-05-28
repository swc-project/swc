// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/modify_guild_role.ts


import { PermissionStrings } from "../permissions/permission_strings.ts";

export interface ModifyGuildRole {
  /** Name of the role */
  name?: string | null;
  /** Bitwise value of the enabled/disabled permissions */
  permissions?: PermissionStrings[] | null;
  /** RGB color value */
  color?: number | null;
  /** Whether the role should be displayed seperately in the sidebar */
  hoist?: boolean | null;
  /** Whether the role should be mentionable */
  mentionable?: boolean | null;
}

/** https://discord.com/developers/docs/resources/guild#modify-guild-role */
export interface DiscordModifyGuildRole extends Omit<ModifyGuildRole, "permissions"> {
  permissions?: string | null;
}
