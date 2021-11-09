// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/roles/create_role.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { CreateGuildRole } from "../../types/guilds/create_guild_role.ts";
import type { Role } from "../../types/permissions/role.ts";
import { endpoints } from "../../util/constants.ts";
import { calculateBits, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Create a new role for the guild. Requires the MANAGE_ROLES permission. */
export async function createRole(guildId: bigint, options: CreateGuildRole, reason?: string) {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  const result = await rest.runMethod<Role>("post", endpoints.GUILD_ROLES(guildId), {
    ...options,
    permissions: calculateBits(options?.permissions || []),
    reason,
  });

  const role = await structures.createDiscordenoRole({
    role: result,
    guildId,
  });

  const guild = await cacheHandlers.get("guilds", guildId);
  if (guild) {
    guild.roles.set(role.id, role);

    await cacheHandlers.set("guilds", guildId, guild);
  }

  return role;
}
