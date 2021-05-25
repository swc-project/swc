// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/invites/target_types.ts


/** https://discord.com/developers/docs/resources/invite#invite-object-target-user-types */
export enum DiscordTargetTypes {
  Stream = 1,
  EmbeddedApplication,
}

export type TargetTypes = DiscordTargetTypes;
export const TargetTypes = DiscordTargetTypes;
