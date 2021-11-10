// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/interaction_response_types.ts


/** https://discord.com/developers/docs/interactions/slash-commands#interaction-response-interactionresponsetype */
export enum DiscordInteractionResponseTypes {
  /** ACK a `Ping` */
  Pong = 1,
  /** Respond to an interaction with a message */
  ChannelMessageWithSource = 4,
  /** ACK an interaction and edit a response later, the user sees a loading state */
  DeferredChannelMessageWithSource = 5,
  /** It has no data fields. You can send this type **only in response to a button interaction .** It will acknowledge the interaction and update the button to a loading state. */
  DeferredMessageUpdate,
}

export type InteractionResponseTypes = DiscordInteractionResponseTypes;
export const InteractionResponseTypes = DiscordInteractionResponseTypes;
