// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/get_gateway_bot.ts


import { SessionStartLimit } from "./session_start_limit.ts";

/** https://discord.com/developers/docs/topics/gateway#get-gateway-bot */
export interface GetGatewayBot {
  /** The WSS URL that can be used for connecting to the gateway */
  url: string;
  /** The recommended number of shards to use when connecting */
  shards: number;
  /** Information on the current session start limit */
  sessionStartLimit: SessionStartLimit;
}
