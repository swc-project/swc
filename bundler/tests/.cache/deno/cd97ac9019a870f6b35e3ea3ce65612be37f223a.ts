// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/roles/get_roles.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import type { Role } from "../../types/permissions/role.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Returns a list of role objects for the guild.
 *
 * ⚠️ **If you need this, you are probably doing something wrong. This is not intended for use. Your roles will be cached in your guild.**
 */
export async function getRoles(guildId: bigint, addToCache = true) {
  await requireBotGuildPermissions(guildId, ["MANAGE_ROLES"]);

  const result = await rest.runMethod<Role[]>("get", endpoints.GUILD_ROLES(guildId));

  const roleStructures = await Promise.all(
    result.map(async (role) => await structures.createDiscordenoRole({ role, guildId }))
  );

  const roles = new Collection(roleStructures.map((role) => [role.id, role]));

  if (addToCache) {
    const guild = await cacheHandlers.get("guilds", guildId);
    if (guild) {
      guild.roles = roles;
      await cacheHandlers.set("guilds", guild.id, guild);
    }
  }

  return roleStructures;
}
