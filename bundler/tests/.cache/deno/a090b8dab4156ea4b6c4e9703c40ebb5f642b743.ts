// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/structures/member.ts


import { eventHandlers } from "../bot.ts";
import { cache, cacheHandlers } from "../cache.ts";
import { avatarURL } from "../helpers/members/avatar_url.ts";
import { banMember } from "../helpers/members/ban_member.ts";
import { editMember } from "../helpers/members/edit_member.ts";
import { kickMember } from "../helpers/members/kick_member.ts";
import { sendDirectMessage } from "../helpers/members/send_direct_message.ts";
import { addRole } from "../helpers/roles/add_role.ts";
import { removeRole } from "../helpers/roles/remove_role.ts";
import type { CreateGuildBan } from "../types/guilds/create_guild_ban.ts";
import type { ModifyGuildMember } from "../types/guilds/modify_guild_member.ts";
import type { GuildMember, GuildMemberWithUser } from "../types/members/guild_member.ts";
import type { CreateMessage } from "../types/messages/create_message.ts";
import type { DiscordImageFormat } from "../types/misc/image_format.ts";
import type { DiscordImageSize } from "../types/misc/image_size.ts";
import type { User } from "../types/users/user.ts";
import { snowflakeToBigint } from "../util/bigint.ts";
import { Collection } from "../util/collection.ts";
import { iconHashToBigInt } from "../util/hash.ts";
import { createNewProp } from "../util/utils.ts";
import { DiscordenoGuild } from "./guild.ts";

const MEMBER_SNOWFLAKES = ["id", "discriminator"];

export const memberToggles = {
  /** Whether the user belongs to an OAuth2 application */
  bot: 1n,
  /** Whether the user is an Official Discord System user (part of the urgent message system) */
  system: 2n,
  /** Whether the user has two factor enabled on their account */
  mfaEnabled: 4n,
  /** Whether the email on this account has been verified */
  verified: 8n,
  /** Whether the users avatar is animated. */
  animatedAvatar: 16n,
};

const baseMember: Partial<DiscordenoMember> = {
  get avatarURL() {
    return avatarURL(this.id!, this.discriminator!, {
      avatar: this.avatar!,
      animated: this.animatedAvatar,
    });
  },
  get mention() {
    return `<@!${this.id!}>`;
  },
  get tag() {
    return `${this.username!}#${this.discriminator!}`;
  },

  // METHODS
  makeAvatarURL(options) {
    return avatarURL(this.id!, this.discriminator!, {
      avatar: this.avatar!,
      size: options?.size,
      format: options?.format,
      animated: this.animatedAvatar!,
    });
  },
  guild(guildId) {
    return cache.guilds.get(guildId);
  },
  name(guildId) {
    return this.guildMember!(guildId)?.nick || this.username!;
  },
  guildMember(guildId) {
    return this.guilds?.get(guildId);
  },
  sendDM(content) {
    return sendDirectMessage(this.id!, content);
  },
  kick(guildId, reason) {
    return kickMember(guildId, this.id!, reason);
  },
  edit(guildId, options) {
    return editMember(guildId, this.id!, options);
  },
  ban(guildId, options) {
    return banMember(guildId, this.id!, options);
  },
  addRole(guildId, roleId, reason) {
    return addRole(guildId, this.id!, roleId, reason);
  },
  removeRole(guildId, roleId, reason) {
    return removeRole(guildId, this.id!, roleId, reason);
  },
  get bot() {
    return Boolean(this.bitfield! & memberToggles.bot);
  },
  get system() {
    return Boolean(this.bitfield! & memberToggles.system);
  },
  get mfaEnabled() {
    return Boolean(this.bitfield! & memberToggles.mfaEnabled);
  },
  get verified() {
    return Boolean(this.bitfield! & memberToggles.verified);
  },
  get animatedAvatar() {
    return Boolean(this.bitfield! & memberToggles.animatedAvatar);
  },
  toJSON() {
    return (this.guilds?.map((g) => ({
      user: {
        id: this.id?.toString(),
        username: this.username,
        discriminator: this.discriminator?.toString(),
        avatar: this.avatar,
        bot: this.bot,
        system: this.system,
        mfaEnabled: this.mfaEnabled,
        locale: this.locale,
        verified: this.verified,
        email: this.email,
        flags: this.flags,
        premiumType: this.premiumType,
        publicFlags: this.publicFlags,
      },
      nick: g.nick,
      roles: g.roles.map((id) => id.toString()),
      joinedAt: g.joinedAt ? new Date(g.joinedAt).toISOString() : undefined,
      premiumSince: g.premiumSince,
      deaf: g.deaf,
      mute: g.mute,
      pending: g.pending,
    })) || []) as (GuildMemberWithUser & { guildId: string })[];
  },
};

export async function createDiscordenoMember(
  // The `user` param in `DiscordGuildMember` is optional since discord does not send it in `MESSAGE_CREATE` and `MESSAGE_UPDATE` events. But this data in there is required to build this structure so it is required in this case
  data: GuildMemberWithUser,
  guildId: bigint
) {
  const { user, joinedAt, premiumSince } = data;

  let bitfield = 0n;
  const props: Record<string, ReturnType<typeof createNewProp>> = {};

  for (const [key, value] of Object.entries(user)) {
    eventHandlers.debug?.("loop", `Running for of for Object.keys(user) loop in DiscordenoMember function.`);

    const toggleBits = memberToggles[key as keyof typeof memberToggles];
    if (toggleBits) {
      bitfield |= value ? toggleBits : 0n;
      continue;
    }

    if (key === "avatar") {
      const transformed = value ? iconHashToBigInt(value) : undefined;
      if (transformed?.animated) bitfield |= memberToggles.animatedAvatar;
      props.avatar = createNewProp(transformed?.bigint);
    }

    props[key] = createNewProp(
      MEMBER_SNOWFLAKES.includes(key) ? (value ? snowflakeToBigint(value) : undefined) : value
    );
  }

  const member: DiscordenoMember = Object.create(baseMember, {
    ...props,
    /** The guild related data mapped by guild id */
    guilds: createNewProp(new Collection<bigint, GuildMember>()),
    bitfield: createNewProp(bitfield),
  });

  const cached = await cacheHandlers.get("members", snowflakeToBigint(user.id));
  if (cached) {
    for (const [id, guild] of cached.guilds.entries()) {
      eventHandlers.debug?.("loop", `Running for of for cached.guilds.entries() loop in DiscordenoMember function.`);
      member.guilds.set(id, guild);
    }
  }

  // User was never cached before
  member.guilds.set(guildId, {
    nick: data.nick,
    roles: data.roles.map((id) => snowflakeToBigint(id)),
    joinedAt: joinedAt ? Date.parse(joinedAt) : undefined,
    premiumSince: premiumSince ? Date.parse(premiumSince) : undefined,
    deaf: data.deaf,
    mute: data.mute,
  });

  return member;
}

export interface DiscordenoMember extends Omit<User, "discriminator" | "id"> {
  /** The user's id */
  id: bigint;
  /** The user's 4-digit discord-tag */
  discriminator: bigint;
  /** The guild related data mapped by guild id */
  guilds: Collection<
    bigint,
    Omit<GuildMember, "joinedAt" | "premiumSince" | "roles"> & {
      joinedAt?: number;
      premiumSince?: number;
      roles: bigint[];
    }
  >;
  /** Holds all the boolean toggles. */
  bitfield: bigint;

  // GETTERS
  /** The avatar url using the default format and size. */
  avatarURL: string;
  /** The mention string for this member */
  mention: string;
  /** The username#discriminator tag for this member */
  tag: string;
  /** Whether or not the avatar is animated. */
  animatedAvatar: boolean;

  // METHODS

  /** Returns the avatar url for this member and can be dynamically modified with a size or format */
  makeAvatarURL(options?: { size?: DiscordImageSize; format?: DiscordImageFormat }): string;
  /** Returns the guild for this guildId */
  guild(guildId: bigint): DiscordenoGuild | undefined;
  /** Get the nickname or the username if no nickname */
  name(guildId: bigint): string;
  /** Get the guild member object for the specified guild */
  guildMember(guildId: bigint):
    | (Omit<GuildMember, "joinedAt" | "premiumSince" | "roles"> & {
        joinedAt?: number;
        premiumSince?: number;
        roles: bigint[];
      })
    | undefined;
  /** Send a direct message to the user is possible */
  sendDM(content: string | CreateMessage): ReturnType<typeof sendDirectMessage>;
  /** Kick the member from a guild */
  kick(guildId: bigint, reason?: string): ReturnType<typeof kickMember>;
  /** Edit the member in a guild */
  edit(
    guildId: bigint,
    options: Omit<ModifyGuildMember, "channelId"> & {
      channelId?: bigint | null;
    }
  ): ReturnType<typeof editMember>;
  /** Ban a member in a guild */
  ban(guildId: bigint, options: CreateGuildBan): ReturnType<typeof banMember>;
  /** Add a role to the member */
  addRole(guildId: bigint, roleId: bigint, reason?: string): ReturnType<typeof addRole>;
  /** Remove a role from the member */
  removeRole(guildId: bigint, roleId: bigint, reason?: string): ReturnType<typeof removeRole>;
  /** Converts to a json object */
  toJSON(): (GuildMemberWithUser & { guildId: string })[];
}
