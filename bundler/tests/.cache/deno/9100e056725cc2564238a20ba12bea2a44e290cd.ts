// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/misc/edit_bot_status.ts


import { eventHandlers } from "../../bot.ts";
import { DiscordGatewayOpcodes } from "../../types/codes/gateway_opcodes.ts";
import type { StatusUpdate } from "../../types/gateway/status_update.ts";
import { ws } from "../../ws/ws.ts";

export function editBotStatus(data: Omit<StatusUpdate, "afk" | "since">) {
  ws.shards.forEach((shard) => {
    eventHandlers.debug?.("loop", `Running forEach loop in editBotStatus function.`);

    ws.sendShardMessage(shard, {
      op: DiscordGatewayOpcodes.StatusUpdate,
      d: {
        since: null,
        afk: false,
        ...data,
      },
    });
  });
}
