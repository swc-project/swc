// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/guilds/GUILD_DELETE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { UnavailableGuild } from "../../types/guilds/unavailable_guild.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { ws } from "../../ws/ws.ts";

export async function handleGuildDelete(data: DiscordGatewayPayload, shardId: number) {
  const payload = data.d as UnavailableGuild;

  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.id));
  if (!guild) return;

  await cacheHandlers.delete("guilds", guild.id);

  if (payload.unavailable) {
    const shard = ws.shards.get(shardId);
    if (shard) shard.unavailableGuildIds.add(guild.id);
    await cacheHandlers.set("unavailableGuilds", guild.id, Date.now());

    eventHandlers.guildUnavailable?.(guild);
  } else {
    eventHandlers.guildDelete?.(guild);
  }

  cacheHandlers.forEach("messages", (message) => {
    eventHandlers.debug?.("loop", `1. Running forEach messages loop in CHANNEL_DELTE file.`);
    if (message.guildId === guild.id) {
      cacheHandlers.delete("messages", message.id);
    }
  });

  cacheHandlers.forEach("channels", (channel) => {
    eventHandlers.debug?.("loop", `2. Running forEach channels loop in CHANNEL_DELTE file.`);
    if (channel.guildId === guild.id) {
      cacheHandlers.delete("channels", channel.id);
    }
  });

  cacheHandlers.forEach("members", (member) => {
    eventHandlers.debug?.("loop", `3. Running forEach members loop in CHANNEL_DELTE file.`);
    if (!member.guilds.has(guild.id)) return;

    member.guilds.delete(guild.id);

    if (!member.guilds.size) {
      return cacheHandlers.delete("members", member.id);
    }

    cacheHandlers.set("members", member.id, member);
  });
}
