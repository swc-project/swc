// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/hello.ts


import { SnakeCasedPropertiesDeep } from "../util.ts";

export interface Hello {
  /** The interval (in milliseconds) the client should heartbeat with */
  heartbeatInterval: number;
}

/** https://discord.com/developers/docs/topics/gateway#hello */
export type DiscordHello = SnakeCasedPropertiesDeep<Hello>;
