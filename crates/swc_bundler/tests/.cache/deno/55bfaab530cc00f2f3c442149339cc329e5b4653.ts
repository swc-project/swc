// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/voice/voice_server_update.ts


/** https://discord.com/developers/docs/topics/gateway#voice-server-update */
export interface VoiceServerUpdate {
  /** Voice connection token */
  token: string;
  /** The guild this voice server update is for */
  guildId: string;
  /** The voice server host */
  endpoint: string | null;
}
