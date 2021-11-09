// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/users/visibility_types.ts


/** https://discord.com/developers/docs/resources/user#connection-object-visibility-types */
export enum DiscordVisibilityTypes {
  /** Invisible to everyone except the user themselves */
  None,
  /** Visible to everyone */
  Everyone,
}

export type VisibilityTypes = DiscordVisibilityTypes;
export const VisibilityTypes = DiscordVisibilityTypes;
