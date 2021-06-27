// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/codes/rpc_close_event_codes.ts


/** https://discord.com/developers/docs/topics/opcodes-and-status-codes#rpc */
export enum DiscordRpcCloseEventCodes {
  InvalidClientId = 4000,
  InvalidOrigin,
  RateLimited,
  TokenRevoked,
  InvalidVersion,
  InvalidEncoding,
}

export type RpcCloseEventCodes = DiscordRpcCloseEventCodes;
export const RpcCloseEventCodes = DiscordRpcCloseEventCodes;
