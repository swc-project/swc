// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/channels/channel_overwrite_has_permission.ts


import type { DiscordOverwrite } from "../../types/channels/overwrite.ts";
import { DiscordBitwisePermissionFlags } from "../../types/permissions/bitwise_permission_flags.ts";
import type { PermissionStrings } from "../../types/permissions/permission_strings.ts";

/** Checks if a channel overwrite for a user id or a role id has permission in this channel */
export function channelOverwriteHasPermission(
  guildId: bigint,
  id: bigint,
  overwrites: (Omit<DiscordOverwrite, "id" | "allow" | "deny"> & {
    id: bigint;
    allow: bigint;
    deny: bigint;
  })[],
  permissions: PermissionStrings[]
) {
  const overwrite = overwrites.find((perm) => perm.id === id) || overwrites.find((perm) => perm.id === guildId);

  if (!overwrite) return false;

  return permissions.every((perm) => {
    const allowBits = overwrite.allow;
    const denyBits = overwrite.deny;
    if (BigInt(denyBits) & BigInt(DiscordBitwisePermissionFlags[perm])) {
      return false;
    }
    if (BigInt(allowBits) & BigInt(DiscordBitwisePermissionFlags[perm])) {
      return true;
    }
  });
}
