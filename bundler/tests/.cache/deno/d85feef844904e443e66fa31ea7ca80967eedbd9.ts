// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/interaction_response.ts


import { InteractionApplicationCommandCallbackData } from "./commands/application_command_callback_data.ts";
import { DiscordInteractionResponseTypes } from "./interaction_response_types.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#interaction-response */
export interface InteractionResponse {
  /** The type of response */
  type: DiscordInteractionResponseTypes;
  /** An optional response message */
  data?: InteractionApplicationCommandCallbackData;
}
