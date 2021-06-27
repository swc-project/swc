// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/roles/edit_role.ts


import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { CreateGuildRole } from "../../types/guilds/create_guild_role.ts";
import type { Role } from "../../types/permissions/role.ts";
import { endpoints } from "../../util/constants.ts";
import { calculateBits, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Edit a guild role. Requires the MANAGE_ROLES permission. */
export async function editRole(guildId: bigint, id: bigint, options: CreateGuildRole) {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  const result = await rest.runMethod<Role>("patch", endpoints.GUILD_ROLE(guildId, id), {
    ...options,
    permissions: options.permissions ? calculateBits(options.permissions) : undefined,
  });

  return await structures.createDiscordenoRole({ role: result, guildId });
}
