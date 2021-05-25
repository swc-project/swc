// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/handle_discord_payload.ts


import type { DiscordGatewayPayload } from "../types/gateway/gateway_payload.ts";
import { ws } from "./ws.ts";

/** Handler for processing all dispatch payloads that should be sent/forwarded to another server/vps/process. */
export async function handleDiscordPayload(data: DiscordGatewayPayload, shardId: number) {
  await fetch(ws.url, {
    headers: {
      authorization: ws.secretKey,
    },
    method: "post",
    body: JSON.stringify({
      shardId,
      data,
    }),
  }).catch(console.error);
}
