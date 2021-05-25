// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/codes/voice_close_event_codes.ts


/** https://discord.com/developers/docs/topics/opcodes-and-status-codes#voice */
export enum DiscordVoiceCloseEventCodes {
  UnknownOpcode = 4001,
  FailedToDecodePayload,
  NotAuthenticated,
  AuthenticationFailed,
  AlreadyAuthenticated,
  SessionNoLongerValid,
  SessionTimedOut = 4009,
  ServerNotFound = 4011,
  UnknownProtocol,
  Disconnect = 4014,
  VoiceServerCrashed,
  UnknownEncryptionMode,
}

export type VoiceCloseEventCodes = DiscordVoiceCloseEventCodes;
export const VoiceCloseEventCodes = DiscordVoiceCloseEventCodes;
