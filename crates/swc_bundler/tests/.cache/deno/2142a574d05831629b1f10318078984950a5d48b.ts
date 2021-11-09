// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/roles/GUILD_ROLE_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildRoleDelete } from "../../types/guilds/guild_role_delete.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildRoleDelete(data: DiscordGatewayPayload) {
  const payload = data.d as GuildRoleDelete;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const roleId = snowflakeToBigint(payload.roleId);

  const cachedRole = guild.roles.get(roleId)!;
  guild.roles.delete(roleId);

  if (cachedRole) eventHandlers.roleDelete?.(guild, cachedRole);

  // For bots without GUILD_MEMBERS member.roles is never updated breaking permissions checking.
  cacheHandlers.forEach("members", (member) => {
    eventHandlers.debug?.("loop", `1. Running forEach members loop in GUILD_ROLE_DELETE file.`);
    // Not in the relevant guild so just skip.
    if (!member.guilds.has(guild.id)) return;

    member.guilds.forEach((g) => {
      eventHandlers.debug?.("loop", `2. Running forEach loop in CHANNEL_DELTE file.`);
      // Member does not have this role
      if (!g.roles.includes(roleId)) return;
      // Remove this role from the members cache
      g.roles = g.roles.filter((id) => id !== roleId);
      cacheHandlers.set("members", member.id, member);
    });
  });
}
