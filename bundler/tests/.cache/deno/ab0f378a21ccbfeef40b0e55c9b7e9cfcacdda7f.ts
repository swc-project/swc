// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/codes/voice_opcodes.ts


/** https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice */
export enum DiscordVoiceOpcodes {
  Identify,
  SelectProtocol,
  Ready,
  Heartbeat,
  SessionDescription,
  Speaking,
  HeartbeatACK,
  Resume,
  Hello,
  Resumed,
  ClientDisconnect = 13,
}

export type VoiceOpcodes = DiscordVoiceOpcodes;
export const VoiceOpcodes = DiscordVoiceOpcodes;
