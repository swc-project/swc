// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/roles/GUILD_ROLE_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildRoleUpdate } from "../../types/guilds/guild_role_update.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildRoleUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as GuildRoleUpdate;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const cachedRole = guild.roles.get(snowflakeToBigint(payload.role.id));
  if (!cachedRole) return;

  const role = await structures.createDiscordenoRole({
    ...payload,
    guildId: guild.id,
  });
  guild.roles.set(snowflakeToBigint(payload.role.id), role);
  await cacheHandlers.set("guilds", guild.id, guild);

  eventHandlers.roleUpdate?.(guild, role, cachedRole);
}
