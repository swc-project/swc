// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/misc/get_gateway_bot.ts


import { rest } from "../../rest/rest.ts";
import type { GetGatewayBot } from "../../types/gateway/get_gateway_bot.ts";
import { endpoints } from "../../util/constants.ts";

/** Get the bots Gateway metadata that can help during the operation of large or sharded bots. */
export async function getGatewayBot() {
  return await rest.runMethod<GetGatewayBot>("get", endpoints.GATEWAY_BOT);
}
