// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/bot.ts


import { getGatewayBot } from "./helpers/misc/get_gateway_bot.ts";
import { rest } from "./rest/rest.ts";
import type { EventHandlers } from "./types/discordeno/event_handlers.ts";
import { DiscordGatewayIntents } from "./types/gateway/gateway_intents.ts";
import { snowflakeToBigint } from "./util/bigint.ts";
import { GATEWAY_VERSION } from "./util/constants.ts";
import { ws } from "./ws/ws.ts";

// deno-lint-ignore prefer-const
export let secretKey = "";
export let botId = 0n;
export let applicationId = 0n;

export let eventHandlers: EventHandlers = {};

export let proxyWSURL = `wss://gateway.discord.gg`;

export async function startBot(config: BotConfig) {
  if (config.eventHandlers) eventHandlers = config.eventHandlers;
  ws.identifyPayload.token = `Bot ${config.token}`;
  rest.token = `Bot ${config.token}`;
  ws.identifyPayload.intents = config.intents.reduce(
    (bits, next) => (bits |= typeof next === "string" ? DiscordGatewayIntents[next] : next),
    0
  );

  // Initial API connection to get info about bots connection
  ws.botGatewayData = await getGatewayBot();
  ws.maxShards = ws.maxShards || ws.botGatewayData.shards;
  ws.lastShardId = ws.lastShardId === 1 ? ws.botGatewayData.shards - 1 : ws.lastShardId;

  // Explicitly append gateway version and encoding
  ws.botGatewayData.url += `?v=${GATEWAY_VERSION}&encoding=json`;

  proxyWSURL = ws.botGatewayData.url;

  ws.spawnShards();
}

export function replaceEventHandlers(newEventHandlers: EventHandlers) {
  eventHandlers = newEventHandlers;
}

/** Allows you to dynamically update the event handlers by passing in new eventHandlers */
export function updateEventHandlers(newEventHandlers: EventHandlers) {
  // Object.assign instead of ... operator because of the Proxy used
  Object.assign(eventHandlers, newEventHandlers);
}

/** INTERNAL LIB function used to set the bot Id once the READY event is sent by Discord. */
export function setBotId(id: string) {
  botId = snowflakeToBigint(id);
}

/** INTERNAL LIB function used to set the application Id once the READY event is sent by Discord. */
export function setApplicationId(id: string) {
  applicationId = snowflakeToBigint(id);
}

export interface BotConfig {
  token: string;
  compress?: boolean;
  intents: (DiscordGatewayIntents | keyof typeof DiscordGatewayIntents)[];
  eventHandlers?: EventHandlers;
}
