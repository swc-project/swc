// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/discordeno/interaction_response.ts


import { InteractionResponse } from "../interactions/interaction_response.ts";

export interface DiscordenoInteractionResponse extends InteractionResponse {
  /** Set to true if the response should be private */
  private?: boolean;
}
