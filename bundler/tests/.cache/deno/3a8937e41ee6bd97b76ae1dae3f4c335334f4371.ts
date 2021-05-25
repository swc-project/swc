// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/guilds/guild_features.ts


/** https://discord.com/developers/docs/resources/guild#guild-object-guild-features */
export enum DiscordGuildFeatures {
  /** Guild has access to set an invite splash background */
  InviteSplash = "INVITE_SPLASH",
  /** Guild has access to set 384kbps bitrate in voice (previously VIP voice servers) */
  VipRegions = "VIP_REGIONS",
  /** Guild has access to set a vanity URL */
  VanityUrl = "VANITY_URL",
  /** Guild is verified */
  Verified = "VERIFIED",
  /** Guild is partnered */
  Partnered = "PARTNERED",
  /** Guild can enable welcome screen, Membership Screening, stage channels and discovery, and recives community updates */
  Community = "COMMUNITY",
  /** Guild has access to use commerce features (i.e. create store channels) */
  Commerce = "COMMERCE",
  /** Guild has access to create news channels */
  News = "NEWS",
  /** Guild is able to be discovered in the directory */
  Discoverable = "DISCOVERABLE",
  /** guild cannot be discoverable */
  DiscoverableDisabled = "DISCOVERABLE_DISABLED",
  /** Guild is able to be featured in the directory */
  Feature = "FEATURABLE",
  /** Guild has access to set an animated guild icon */
  AnimatedIcon = "ANIMATED_ICON",
  /** Guild has access to set a guild banner image */
  Banner = "BANNER",
  /** Guild has enabled the welcome screen */
  WelcomeScreenEnabled = "WELCOME_SCREEN_ENABLED",
  /** Guild has enabled [Membership Screening](https://discord.com/developers/docs/resources/guild#membership-screening-object) */
  MemberVerificationGateEnabled = "MEMBER_VERIFICATION_GATE_ENABLED",
  /** Guild can be previewed before joining via Membership Screening or the directory */
  PreviewEnabled = "PREVIEW_ENABLED",
}

export type GuildFeatures = DiscordGuildFeatures;
export const GuildFeatures = DiscordGuildFeatures;
