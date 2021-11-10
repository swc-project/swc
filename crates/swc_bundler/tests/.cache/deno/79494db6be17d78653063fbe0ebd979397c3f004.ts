// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/premium_tiers.ts


/** https://discord.com/developers/docs/resources/guild#guild-object-premium-tier */
export enum DiscordPremiumTiers {
  /** Guild has not unlocked any Server Boost perks */
  None,
  /** Guild has unlocked Server Boost level 1 perks */
  Tier1,
  /** Guild has unlocked Server Boost level 2 perks */
  Tier2,
  /** Guild has unlocked Server Boost level 3 perks */
  Tier3,
}

export type PremiumTiers = DiscordPremiumTiers;
export const PremiumTiers = DiscordPremiumTiers;
