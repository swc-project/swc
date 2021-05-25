// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/guilds/GUILD_BAN_ADD.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildBanAddRemove } from "../../types/guilds/guild_ban_add_remove.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildBanAdd(data: DiscordGatewayPayload) {
  const payload = data.d as GuildBanAddRemove;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const member = await cacheHandlers.get("members", snowflakeToBigint(payload.user.id));
  eventHandlers.guildBanAdd?.(guild, payload.user, member);
}
