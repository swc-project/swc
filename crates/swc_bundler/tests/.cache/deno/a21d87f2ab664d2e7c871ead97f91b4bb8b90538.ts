// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/verification_levels.ts


/** https://discord.com/developers/docs/resources/guild#guild-object-verification-level */
export enum DiscordVerificationLevels {
  /** Unrestricted */
  None,
  /** Must have verified email on account */
  Low,
  /** Must be registered on Discord for longer than 5 minutes */
  Medium,
  /** Must be a member of the server for longer than 10 minutes */
  High,
  /** Must have a verified phone number */
  VeryHigh,
}

export type VerificationLevels = DiscordVerificationLevels;
export const VerificationLevels = DiscordVerificationLevels;
