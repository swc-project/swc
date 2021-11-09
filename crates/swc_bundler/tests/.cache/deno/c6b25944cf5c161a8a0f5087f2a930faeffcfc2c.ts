// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/structures/guild.ts


import { botId, eventHandlers } from "../bot.ts";
import { cache, cacheHandlers } from "../cache.ts";
import { deleteGuild } from "../helpers/guilds/delete_guild.ts";
import { editGuild } from "../helpers/guilds/edit_guild.ts";
import { getAuditLogs } from "../helpers/guilds/get_audit_logs.ts";
import { getBan } from "../helpers/guilds/get_ban.ts";
import { getBans } from "../helpers/guilds/get_bans.ts";
import { guildBannerURL } from "../helpers/guilds/guild_banner_url.ts";
import { guildIconURL } from "../helpers/guilds/guild_icon_url.ts";
import { guildSplashURL } from "../helpers/guilds/guild_splash_url.ts";
import { leaveGuild } from "../helpers/guilds/leave_guild.ts";
import { getInvites } from "../helpers/invites/get_invites.ts";
import { banMember } from "../helpers/members/ban_member.ts";
import { unbanMember } from "../helpers/members/unban_member.ts";
import type { PresenceUpdate } from "../types/activity/presence_update.ts";
import { GetGuildAuditLog } from "../types/audit_log/get_guild_audit_log.ts";
import type { Emoji } from "../types/emojis/emoji.ts";
import type { CreateGuildBan } from "../types/guilds/create_guild_ban.ts";
import type { Guild } from "../types/guilds/guild.ts";
import { DiscordGuildFeatures } from "../types/guilds/guild_features.ts";
import type { ModifyGuild } from "../types/guilds/modify_guild.ts";
import type { GuildMember, GuildMemberWithUser } from "../types/members/guild_member.ts";
import type { DiscordImageFormat } from "../types/misc/image_format.ts";
import type { DiscordImageSize } from "../types/misc/image_size.ts";
import { snowflakeToBigint } from "../util/bigint.ts";
import { cacheMembers } from "../util/cache_members.ts";
import { Collection } from "../util/collection.ts";
import { iconHashToBigInt } from "../util/hash.ts";
import { createNewProp } from "../util/utils.ts";
import { DiscordenoChannel } from "./channel.ts";
import { DiscordenoMember } from "./member.ts";
import { structures } from "./mod.ts";
import { DiscordenoRole } from "./role.ts";
import { DiscordenoVoiceState } from "./voice_state.ts";

const GUILD_SNOWFLAKES = [
  "id",
  "ownerId",
  "permissions",
  "afkChannelId",
  "widgetChannelId",
  "applicationId",
  "systemChannelId",
  "rulesChannelId",
  "publicUpdatesChannelId",
];

export const guildToggles = {
  /** Whether this user is owner of this guild */
  owner: 1n,
  /** Whether the guild widget is enabled */
  widgetEnabled: 2n,
  /** Whether this is a large guild */
  large: 4n,
  /** Whether this guild is unavailable due to an outage */
  unavailable: 8n,
  /** Whether this server's icon is animated */
  animatedIcon: 16n,
  /** Whether this server's banner is animated. */
  animatedBanner: 32n,
  /** Whether this server's splash is animated. */
  animatedSplash: 64n,
};

const baseGuild: Partial<DiscordenoGuild> = {
  toJSON() {
    return {
      shardId: this.shardId!,
      id: this.id?.toString(),
      name: this.name,
      icon: this.icon,
      iconHash: undefined,
      splash: this.splash,
      discoverySplash: this.discoverySplash,
      owner: this.owner,
      ownerId: this.ownerId?.toString(),
      permissions: this.permissions,
      region: this.region,
      afkChannelId: this.afkChannelId?.toString(),
      afkTimeout: this.afkTimeout,
      widgetEnabled: this.widgetEnabled,
      widgetChannelId: this.widgetChannelId?.toString(),
      verificationLevel: this.verificationLevel,
      defaultMessageNotifications: this.defaultMessageNotifications,
      explicitContentFilter: this.explicitContentFilter,
      roles: this.roles?.map((r) => r.toJSON()) || [],
      emojis: this.emojis?.array() || [],
      features: this.features,
      mfaLevel: this.mfaLevel,
      applicationId: this.applicationId?.toString(),
      systemChannelId: this.systemChannelId?.toString(),
      systemChannelFlags: this.systemChannelFlags,
      rulesChannelId: this.rulesChannelId?.toString(),
      joinedAt: this.joinedAt ? new Date(this.joinedAt).toISOString() : undefined,
      large: this.large,
      unavailable: this.unavailable,
      memberCount: this.memberCount,
      voiceStates: this.voiceStates,
      members: this.members,
      channels: this.channels,
      threads: this.threads,
      presences: this.presences,
      maxPresences: this.maxPresences,
      maxMembers: this.maxMembers,
      vanityUrlCode: this.vanityUrlCode,
      description: this.description,
      banner: this.banner,
      premiumTier: this.premiumTier,
      premiumSubscriptionCount: this.premiumSubscriptionCount,
      preferredLocale: this.preferredLocale,
      publicUpdatesChannelId: this.publicUpdatesChannelId?.toString(),
      maxVideoChannelUsers: this.maxVideoChannelUsers,
      approximateMemberCount: this.approximateMemberCount,
      approximatePresenceCount: this.approximatePresenceCount,
      welcomeScreen: this.welcomeScreen,
      nsfwLevel: this.nsfwLevel,
      stageInstances: this.stageInstances,
    } as Guild & { shardId: number };
  },
  get members() {
    return cache.members.filter((member) => member.guilds.has(this.id!));
  },
  get channels() {
    return cache.channels.filter((channel) => channel.guildId === this.id);
  },
  get afkChannel() {
    return cache.channels.get(this.afkChannelId!);
  },
  get publicUpdatesChannel() {
    return cache.channels.get(this.publicUpdatesChannelId!);
  },
  get rulesChannel() {
    return cache.channels.get(this.rulesChannelId!);
  },
  get systemChannel() {
    return cache.channels.get(this.systemChannelId!);
  },
  get bot() {
    return cache.members.get(botId);
  },
  get botMember() {
    return this.bot?.guilds.get(this.id!);
  },
  get botVoice() {
    return this.voiceStates?.get(botId);
  },
  get owner() {
    return cache.members.get(this.ownerId!);
  },
  get partnered() {
    return Boolean(this.features?.includes(DiscordGuildFeatures.Partnered));
  },
  get verified() {
    return Boolean(this.features?.includes(DiscordGuildFeatures.Verified));
  },
  bannerURL(size, format) {
    return guildBannerURL(this.id!, {
      banner: this.banner!,
      size,
      format,
      animated: this.animatedBanner!,
    });
  },
  splashURL(size, format) {
    return guildSplashURL(this.id!, {
      splash: this.splash!,
      size,
      format,
      animated: this.animatedSplash,
    });
  },
  delete() {
    return deleteGuild(this.id!);
  },
  edit(options) {
    return editGuild(this.id!, options);
  },
  auditLogs(options) {
    return getAuditLogs(this.id!, options);
  },
  getBan(memberId) {
    return getBan(this.id!, memberId);
  },
  bans() {
    return getBans(this.id!);
  },
  ban(memberId, options) {
    return banMember(this.id!, memberId, options);
  },
  unban(memberId) {
    return unbanMember(this.id!, memberId);
  },
  invites() {
    return getInvites(this.id!);
  },
  iconURL(size, format) {
    return guildIconURL(this.id!, {
      icon: this.icon!,
      size,
      format,
      animated: this.animatedIcon!,
    });
  },
  leave() {
    return leaveGuild(this.id!);
  },
  get isOwner() {
    return Boolean(this.bitfield! & guildToggles.owner);
  },
  get widgetEnabled() {
    return Boolean(this.bitfield! & guildToggles.widgetEnabled);
  },
  get large() {
    return Boolean(this.bitfield! & guildToggles.large);
  },
  get unavailable() {
    return Boolean(this.bitfield! & guildToggles.unavailable);
  },
  get animatedIcon() {
    return Boolean(this.bitfield! & guildToggles.animatedIcon);
  },
  get animatedBanner() {
    return Boolean(this.bitfield! & guildToggles.animatedBanner);
  },
  get animatedSplash() {
    return Boolean(this.bitfield! & guildToggles.animatedSplash);
  },
};

export async function createDiscordenoGuild(data: Guild, shardId: number) {
  const {
    memberCount = 0,
    voiceStates = [],
    channels = [],
    threads = [],
    presences = [],
    joinedAt = "",
    emojis = [],
    members = [],
    icon,
    splash,
    banner,
    ...rest
  } = data;

  let bitfield = 0n;
  const guildId = snowflakeToBigint(rest.id);

  const roles = await Promise.all(
    (data.roles || []).map((role) =>
      structures.createDiscordenoRole({
        role,
        guildId,
      })
    )
  );

  const voiceStateStructs = await Promise.all(
    voiceStates.map((vs) => structures.createDiscordenoVoiceState(guildId, vs))
  );

  await Promise.all(
    [...channels, ...threads].map(async (channel) => {
      const discordenoChannel = await structures.createDiscordenoChannel(channel, guildId);

      return await cacheHandlers.set("channels", discordenoChannel.id, discordenoChannel);
    })
  );

  const props: Record<string, ReturnType<typeof createNewProp>> = {};
  for (const [key, value] of Object.entries(rest)) {
    eventHandlers.debug?.("loop", `Running for of loop in createDiscordenoGuild function.`);

    const toggleBits = guildToggles[key as keyof typeof guildToggles];
    if (toggleBits) {
      bitfield |= value ? toggleBits : 0n;
      continue;
    }

    props[key] = createNewProp(GUILD_SNOWFLAKES.includes(key) ? (value ? snowflakeToBigint(value) : undefined) : value);
  }

  const hashes = [
    { name: "icon", toggle: guildToggles.animatedIcon, value: icon },
    { name: "banner", toggle: guildToggles.animatedBanner, value: banner },
    { name: "splash", toggle: guildToggles.animatedSplash, value: splash },
  ];

  for (const hash of hashes) {
    const transformed = hash.value ? iconHashToBigInt(hash.value) : undefined;
    if (transformed) {
      props[hash.name] = createNewProp(hash.value);
      if (transformed.animated) bitfield |= hash.toggle;
    }
  }

  const guild: DiscordenoGuild = Object.create(baseGuild, {
    ...props,
    shardId: createNewProp(shardId),
    roles: createNewProp(new Collection(roles.map((r: DiscordenoRole) => [r.id, r]))),
    joinedAt: createNewProp(Date.parse(joinedAt)),
    presences: createNewProp(new Collection(presences.map((p) => [snowflakeToBigint(p.user!.id), p]))),
    memberCount: createNewProp(memberCount),
    emojis: createNewProp(new Collection(emojis.map((emoji) => [snowflakeToBigint(emoji.id!), emoji]))),
    voiceStates: createNewProp(new Collection(voiceStateStructs.map((vs) => [vs.userId, vs]))),
    bitfield: createNewProp(bitfield),
  });

  await cacheMembers(guild.id, members as GuildMemberWithUser[]);

  return guild;
}

export interface DiscordenoGuild
  extends Omit<
    Guild,
    | "roles"
    | "presences"
    | "voiceStates"
    | "members"
    | "channels"
    | "memberCount"
    | "owner"
    | "emojis"
    | "id"
    | "ownerId"
    | "permissions"
    | "afkChannelId"
    | "widgetChannelId"
    | "applicationId"
    | "systemChannelId"
    | "rulesChannelId"
    | "publicUpdatesChannelId"
  > {
  /** Guild id */
  id: bigint;
  /** Id of the owner */
  ownerId: bigint;
  /** Total permissions for the user in the guild (execludes overrides) */
  permissions: bigint;
  /** Id of afk channel */
  afkChannelId?: bigint;
  /** The channel id that the widget will generate an invite to, or null if set to no invite */
  widgetChannelId?: bigint;
  /** Application id of the guild creator if it is bot-created */
  applicationId?: bigint;
  /** The id of the channel where guild notices such as welcome messages and boost events are posted */
  systemChannelId?: bigint;
  /** The id of the channel where community guilds can display rules and/or guidelines */
  rulesChannelId?: bigint;
  /** The id of the channel where admins and moderators of Community guilds receive notices from Discord */
  publicUpdatesChannelId?: bigint;
  /** Whether this server's icon is animated */
  animatedIcon: boolean;
  /** Whether this server's banner is animated. */
  animatedBanner: boolean;
  /** Whether this server's splash is animated. */
  animatedSplash: boolean;
  /** The id of the shard this guild is bound to */
  shardId: number;
  /** Total number of members in this guild */
  memberCount: number;
  /** The roles in the guild */
  roles: Collection<bigint, DiscordenoRole>;
  /** The presences of all the users in the guild. */
  presences: Collection<bigint, PresenceUpdate>;
  /** The Voice State data for each user in a voice channel in this server. */
  voiceStates: Collection<bigint, DiscordenoVoiceState>;
  /** Custom guild emojis */
  emojis: Collection<bigint, Emoji>;
  /** Whether the bot is the owner of this guild */
  isOwner: boolean;
  /** Holds all the boolean toggles. */
  bitfield: bigint;

  // GETTERS
  /** Members in this guild. */
  members: Collection<bigint, DiscordenoMember>;
  /** Channels in this guild. */
  channels: Collection<bigint, DiscordenoChannel>;
  /** The afk channel if one is set */
  afkChannel?: DiscordenoChannel;
  /** The public update channel if one is set */
  publicUpdatesChannel?: DiscordenoChannel;
  /** The rules channel in this guild if one is set */
  rulesChannel?: DiscordenoChannel;
  /** The system channel in this guild if one is set */
  systemChannel?: DiscordenoChannel;
  /** The bot member in this guild if cached */
  bot?: DiscordenoMember;
  /** The bot guild member in this guild if cached */
  botMember?: Omit<GuildMember, "joinedAt" | "premiumSince" | "roles"> & {
    joinedAt?: number;
    premiumSince?: number;
    roles: bigint[];
  };
  /** The bots voice state if there is one in this guild */
  botVoice?: DiscordenoVoiceState;
  /** The owner member of this guild */
  owner?: DiscordenoMember;
  /** Whether or not this guild is partnered */
  partnered: boolean;
  /** Whether or not this guild is verified */
  verified: boolean;

  // METHODS

  /** The banner url for this server */
  bannerURL(size?: DiscordImageSize, format?: DiscordImageFormat): string | undefined;
  /** The splash url for this server */
  splashURL(size?: DiscordImageSize, format?: DiscordImageFormat): string | undefined;
  /** The full URL of the icon from Discords CDN. Undefined when no icon is set. */
  iconURL(size?: DiscordImageSize, format?: DiscordImageFormat): string | undefined;
  /** Delete a guild permanently. User must be owner. Returns 204 No Content on success. Fires a Guild Delete Gateway event. */
  delete(): ReturnType<typeof deleteGuild>;
  /** Leave a guild */
  leave(): ReturnType<typeof leaveGuild>;
  /** Edit the server. Requires the MANAGE_GUILD permission. */
  edit(options: ModifyGuild): ReturnType<typeof editGuild>;
  /** Returns the audit logs for the guild. Requires VIEW AUDIT LOGS permission */
  auditLogs(options: Partial<GetGuildAuditLog>): ReturnType<typeof getAuditLogs>;
  /** Returns a ban object for the given user or a 404 not found if the ban cannot be found. Requires the BAN_MEMBERS permission. */
  getBan(memberId: bigint): ReturnType<typeof getBan>;
  /** Returns a list of ban objects for the users banned from this guild. Requires the BAN_MEMBERS permission. */
  bans(): ReturnType<typeof getBans>;
  /** Ban a user from the guild and optionally delete previous messages sent by the user. Requires the BAN_MEMBERS permission. */
  ban(memberId: bigint, options: CreateGuildBan): ReturnType<typeof banMember>;
  /** Remove the ban for a user. Requires BAN_MEMBERS permission */
  unban(memberId: bigint): ReturnType<typeof unbanMember>;
  /** Get all the invites for this guild. Requires MANAGE_GUILD permission */
  invites(): ReturnType<typeof getInvites>;
  /** Get the JSON version of the Guild object used to create this. Includes the shardId as well */
  toJSON(): Guild & { shardId: number };
}
