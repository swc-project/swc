// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/handlers/voice/VOICE_SERVER_UPDATE.ts


import { eventHandlers } from "../../bot.ts";
import { cacheHandlers } from "../../cache.ts";
import type { DiscordGatewayPayload } from "../../types/gateway/gateway_payload.ts";
import type { VoiceServerUpdate } from "../../types/voice/voice_server_update.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";

export async function handleVoiceServerUpdate(data: DiscordGatewayPayload) {
  const payload = data.d as VoiceServerUpdate;

  const guild = await cacheHandlers.get("guilds", snowflakeToBigint(payload.guildId));
  if (!guild) return;

  eventHandlers.voiceServerUpdate?.(payload, guild);
}
