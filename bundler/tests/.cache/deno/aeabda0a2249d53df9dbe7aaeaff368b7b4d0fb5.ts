// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/voice/VOICE_STATE_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import { structures } from "../../structures/mod.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { VoiceState } from "../../types/voice/voice_state.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleVoiceStateUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as VoiceState;
  if (!payload.guildId) return;

  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  const member = payload.member
    ? await structures.createDiscordenoMember(payload.member, guild.id)
    : await cacheHandlers.get("members", snowflakeToBigint(payload.userId));
  if (!member) return;

  // No cached state before so lets make one for em
  const cachedState = guild.voiceStates.get(snowflakeToBigint(payload.userId));

  guild.voiceStates.set(
    snowflakeToBigint(payload.userId),
    await structures.createDiscordenoVoiceState(guild.id, payload)
  );

  await cacheHandlers.set("guilds", guild.id, guild);

  if (cachedState?.channelId !== (payload.channelId ? snowflakeToBigint(payload.channelId) : null)) {
    // Either joined or moved channels
    if (payload.channelId) {
      if (cachedState?.channelId) {
        // Was in a channel before
        eventHandlers.voiceChannelSwitch?.(member, snowflakeToBigint(payload.channelId), cachedState.channelId);
      } else {
        // Was not in a channel before so user just joined
        eventHandlers.voiceChannelJoin?.(member, snowflakeToBigint(payload.channelId));
      }
    } // Left the channel
    else if (cachedState?.channelId) {
      guild.voiceStates.delete(snowflakeToBigint(payload.userId));
      eventHandlers.voiceChannelLeave?.(member, cachedState.channelId);
    }
  }

  eventHandlers.voiceStateUpdate?.(member, payload);
}
