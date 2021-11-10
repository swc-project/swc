// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discordeno/debug_arg.ts


export interface DebugArg {
  /** Red is for errors or urgent issues. Yellow is for warnings/alerts. Green is for actions being taken. Blue is for  */
  type?:
    | "gatewayIdentify"
    | "error"
    | "globallyRateLimited"
    | "requestCreate"
    | "requestSuccess"
    | "requestFetch"
    | "requestFetched"
    | "requestMembersProcessing"
    | "gatewayHeartbeat"
    | "gatewayHeartbeatStopped"
    | "shardCreate"
    | "gatewayInvalidSession"
    | "gatewayReconnect"
    | "gatewayResume"
    | "gatewayResumed"
    | "wsClose"
    | "wsError"
    | "wsReconnect"
    | "missingShard"
    | "loop";
  data: unknown;
}
