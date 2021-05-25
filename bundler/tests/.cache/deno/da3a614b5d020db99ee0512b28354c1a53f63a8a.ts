// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/message_interaction.ts


import { User } from "../users/user.ts";
import { DiscordInteractionTypes } from "./interaction_types.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#messageinteraction */
export interface MessageInteraction {
  /** Id of the interaction */
  id: string;
  /** The type of interaction */
  type: DiscordInteractionTypes;
  /** The name of the ApplicationCommand */
  name: string;
  /** The user who invoked the interaction */
  user: User;
}
