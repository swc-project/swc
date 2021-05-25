// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/roles/GUILD_ROLE_CREATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildRoleCreate } from "../../types/guilds/guild_role_create.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildRoleCreate(data: DiscordGatewayPayload) {
  const payload = data.d as GuildRoleCreate;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const role = await structures.createDiscordenoRole({
    ...payload,
    guildId: guild.id,
  });
  guild.roles = guild.roles.set(snowflakeToBigint(payload.role.id), role);
  await cacheHandlers.set("guilds", guild.id, guild);

  eventHandlers.roleCreate?.(guild, role);
}
