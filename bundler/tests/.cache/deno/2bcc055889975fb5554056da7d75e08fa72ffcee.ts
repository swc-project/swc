// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/ws/create_shard.ts


import { DiscordGatewayCloseEventCodes } from "../types/codes/gateway_close_event_codes.ts";
import { identify } from "./identify.ts";
import { resume } from "./resume.ts";
import { ws } from "./ws.ts";

// deno-lint-ignore require-await
export async function createShard(shardId: number) {
  const socket = new WebSocket(ws.botGatewayData.url);
  socket.binaryType = "arraybuffer";

  socket.onerror = (errorEvent) => {
    ws.log("ERROR", { shardId, error: errorEvent });
  };

  socket.onmessage = ({ data: message }) => ws.handleOnMessage(message, shardId);

  socket.onclose = (event) => {
    ws.log("CLOSED", { shardId, payload: event });

    if (event.code === 3064 || event.reason === "Discordeno Testing Finished! Do Not RESUME!") {
      return;
    }

    if (event.code === 3065 || ["Resharded!", "Resuming the shard, closing old shard."].includes(event.reason)) {
      return ws.log("CLOSED_RECONNECT", { shardId, payload: event });
    }

    switch (event.code) {
      // Discordeno tests finished
      case 3061:
        return;
      case 3063: // Resharded
      case 3064: // Resuming
      case 3065: // Reidentifying
      case 3066: // Missing ACK
        // Will restart shard manually
        return ws.log("CLOSED_RECONNECT", { shardId, payload: event });
      case DiscordGatewayCloseEventCodes.UnknownOpcode:
      case DiscordGatewayCloseEventCodes.DecodeError:
      case DiscordGatewayCloseEventCodes.AuthenticationFailed:
      case DiscordGatewayCloseEventCodes.AlreadyAuthenticated:
      case DiscordGatewayCloseEventCodes.InvalidShard:
      case DiscordGatewayCloseEventCodes.ShardingRequired:
      case DiscordGatewayCloseEventCodes.InvalidApiVersion:
      case DiscordGatewayCloseEventCodes.InvalidIntents:
      case DiscordGatewayCloseEventCodes.DisallowedIntents:
        throw new Error(event.reason || "Discord gave no reason! GG! You broke Discord!");
      // THESE ERRORS CAN NO BE RESUMED! THEY MUST RE-IDENTIFY!
      case DiscordGatewayCloseEventCodes.NotAuthenticated:
      case DiscordGatewayCloseEventCodes.InvalidSeq:
      case DiscordGatewayCloseEventCodes.RateLimited:
      case DiscordGatewayCloseEventCodes.SessionTimedOut:
        identify(shardId, ws.maxShards);
        break;
      default:
        resume(shardId);
        break;
    }
  };

  return socket;
}
