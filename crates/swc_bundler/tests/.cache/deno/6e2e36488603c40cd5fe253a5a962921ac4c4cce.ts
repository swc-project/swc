// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/interaction_types.ts


/** https://discord.com/developers/docs/interactions/slash-commands#interaction-interactiontype */
export enum DiscordInteractionTypes {
  Ping = 1,
  ApplicationCommand,
  Button,
}

export type InteractionTypes = DiscordInteractionTypes;
export const InteractionTypes = DiscordInteractionTypes;
