// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/guilds/GUILD_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { GuildUpdateChange } from "../../types/discordeno/guild_update_change.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { Guild } from "../../types/guilds/guild.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildUpdate(data: DiscordGatewayPayload, shardId: number) {
  const payload = data.d as Guild;
  const oldGuild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.id));
  if (!oldGuild) return;

  const keysToSkip = ["id", "roles", "guildHashes", "guildId", "maxMembers", "emojis"];

  const newGuild = await structures.createDiscordenoGuild(payload, shardId);

  const changes = Object.entries(newGuild)
    .map(([key, value]) => {
      if (keysToSkip.includes(key)) return;

      // @ts-ignore index signature
      const cachedValue = oldGuild[key];

      if (cachedValue === value) return;
      // Guild create sends undefined and update sends false.
      if (!cachedValue && !value) return;

      if (Array.isArray(cachedValue) && Array.isArray(value)) {
        const different =
          cachedValue.length !== value.length ||
          cachedValue.find((val) => !value.includes(val)) ||
          value.find((val) => !cachedValue.includes(val));
        if (!different) return;
      }

      return { key, oldValue: cachedValue, value };
    })
    .filter((change) => change) as GuildUpdateChange[];

  await cacheHandlers.set("guilds", newGuild.id, newGuild);

  eventHandlers.guildUpdate?.(newGuild, changes);
}
