// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/permissions/permission_strings.ts


import { DiscordBitwisePermissionFlags } from "./bitwise_permission_flags.ts";

export type PermissionStrings = keyof typeof DiscordBitwisePermissionFlags;
export type Permission = PermissionStrings;
