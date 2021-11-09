// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/members/GUILD_MEMBER_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { GuildMemberUpdate } from "../../types/members/guild_member_update.ts";
import { bigintToSnowflake, snowflakeToBigint } from "../../util/bigint.ts";

export async function handleGuildMemberUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as GuildMemberUpdate;
  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const cachedMember = await cacheHandlers.get("members", snowflakeToBigint(payload.user.id));
  const guildMember = cachedMember?.guilds.get(guild.id);

  const newMemberData = {
    ...payload,
    premiumSince: payload.premiumSince || undefined,
    joinedAt: new Date(guildMember?.joinedAt || Date.now()).toISOString(),
    deaf: guildMember?.deaf || false,
    mute: guildMember?.mute || false,
    roles: payload.roles,
  };
  const discordenoMember = await structures.createDiscordenoMember(newMemberData, guild.id);
  await cacheHandlers.set("members", discordenoMember.id, discordenoMember);

  if (guildMember) {
    if (guildMember.nick !== payload.nick) {
      eventHandlers.nicknameUpdate?.(guild, discordenoMember, payload.nick!, guildMember.nick ?? undefined);
    }

    if (payload.pending === false && guildMember.pending === true) {
      eventHandlers.membershipScreeningPassed?.(guild, discordenoMember);
    }

    const roleIds = guildMember.roles || [];

    roleIds.forEach((id) => {
      eventHandlers.debug?.("loop", `1. Running forEach loop in GUILD_MEMBER_UPDATE file.`);
      if (!payload.roles.includes(bigintToSnowflake(id))) {
        eventHandlers.roleLost?.(guild, discordenoMember, id);
      }
    });

    payload.roles.forEach((id) => {
      eventHandlers.debug?.("loop", `2. Running forEach loop in GUILD_MEMBER_UPDATE file.`);
      if (!roleIds.includes(snowflakeToBigint(id))) {
        eventHandlers.roleGained?.(guild, discordenoMember, snowflakeToBigint(id));
      }
    });
  }

  eventHandlers.guildMemberUpdate?.(guild, discordenoMember, cachedMember);
}
