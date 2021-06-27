// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/members/GUILD_MEMBER_ADD.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildMemberAdd } from "../../types/members/guild_member_add.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildMemberAdd(data: DiscordGatewayPayload) {
  const payload = data.d as GuildMemberAdd;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  guild.memberCount++;
  const discordenoMember = await structures.createDiscordenoMember(payload, guild.id);
  await cacheHandlers.set("members", discordenoMember.id, discordenoMember);

  eventHandlers.guildMemberAdd?.(guild, discordenoMember);
}
