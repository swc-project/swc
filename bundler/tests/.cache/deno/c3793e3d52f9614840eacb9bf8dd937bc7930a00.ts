// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/mfa_levels.ts


/** https://discord.com/developers/docs/resources/guild#guild-object-mfa-level */
export enum DiscordMfaLevels {
  /** Guild has no MFA/2FA requirement for moderation actions */
  None,
  /** Guild has a 2FA requirement for moderation actions */
  Elevated,
}

export type MfaLevels = DiscordMfaLevels;
export const MfaLevels = DiscordMfaLevels;
