// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/codes/gateway_opcodes.ts


/** https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-opcodes */
export enum DiscordGatewayOpcodes {
  Dispatch,
  Heartbeat,
  Identify,
  StatusUpdate,
  VoiceStateUpdate,
  Resume = 6,
  Reconnect,
  RequestGuildMembers,
  InvalidSession,
  Hello,
  HeartbeatACK,
}

export type GatewayOpcodes = DiscordGatewayOpcodes;
export const GatewayOpcodes = DiscordGatewayOpcodes;
