// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/structures/role.ts


import { eventHandlers } from "../bot.ts";
import { cache } from "../cache.ts";
import { deleteRole } from "../helpers/roles/delete_role.ts";
import { editRole } from "../helpers/roles/edit_role.ts";
import { CreateGuildRole } from "../types/guilds/create_guild_role.ts";
import { Errors } from "../types/discordeno/errors.ts";
import type { Role } from "../types/permissions/role.ts";
import { snowflakeToBigint } from "../util/bigint.ts";
import { Collection } from "../util/collection.ts";
import { highestRole } from "../util/permissions.ts";
import { createNewProp } from "../util/utils.ts";
import { DiscordenoGuild } from "./guild.ts";
import { DiscordenoMember } from "./member.ts";

const ROLE_SNOWFLAKES = ["id", "botId", "integrationId", "guildId"];

const roleToggles = {
  /** If this role is showed seperately in the user listing */
  hoist: 1n,
  /** Whether this role is managed by an integration */
  managed: 2n,
  /** Whether this role is mentionable */
  mentionable: 4n,
  /** If this role is the nitro boost role. */
  isNitroBoostRole: 8n,
};

const baseRole: Partial<DiscordenoRole> = {
  get guild() {
    return cache.guilds.get(this.guildId!);
  },
  get hexColor() {
    return this.color!.toString(16);
  },
  get members() {
    return cache.members.filter((m) => m.guilds.some((g) => g.roles.includes(this.id!)));
  },
  get mention() {
    return `<@&${this.id}>`;
  },

  // METHODS
  delete() {
    return deleteRole(this.guildId!, this.id!);
  },
  edit(options) {
    return editRole(this.guildId!, this.id!, options);
  },
  higherThanRole(roleId: bigint, position?: number) {
    // If no position try and find one from cache
    if (!position) position = this.guild?.roles.get(roleId)?.position;
    // If still none error out.
    if (!position) {
      throw new Error(
        "role.higherThanRoleId() did not have a position provided and the role or guild was not found in cache. Please provide a position like role.higherThanRoleId(roleId, position)"
      );
    }

    // Rare edge case handling
    if (this.position === position) {
      return this.id! < roleId;
    }

    return this.position! > position;
  },
  async higherThanMember(memberId: bigint) {
    const guild = this.guild;
    if (!guild) throw new Error(Errors.GUILD_NOT_FOUND);

    if (guild.ownerId === memberId) return false;

    const memberHighestRole = await highestRole(guild, memberId);
    return this.higherThanRole!(memberHighestRole.id, memberHighestRole.position);
  },
  get hoist() {
    return Boolean(this.bitfield! & roleToggles.hoist);
  },
  get managed() {
    return Boolean(this.bitfield! & roleToggles.managed);
  },
  get mentionable() {
    return Boolean(this.bitfield! & roleToggles.mentionable);
  },
  get isNitroBoostRole() {
    return Boolean(this.bitfield! & roleToggles.isNitroBoostRole);
  },
  toJSON() {
    return {
      guildId: this.guildId?.toString(),
      id: this.id?.toString(),
      name: this.name,
      color: this.color,
      hoist: this.hoist,
      position: this.position,
      permissions: this.permissions?.toString(),
      managed: this.managed,
      mentionable: this.mentionable,
      tags: {
        botId: this.botId?.toString(),
        integrationId: this.integrationId?.toString(),
        premiumSubscriber: this.isNitroBoostRole,
      },
    } as Role & { guildId: string };
  },
};

// deno-lint-ignore require-await
export async function createDiscordenoRole(
  data: { role: Role } & {
    guildId: bigint;
  }
) {
  const { tags = {}, ...rest } = { guildId: data.guildId, ...data.role };

  let bitfield = 0n;

  const props: Record<string, ReturnType<typeof createNewProp>> = {};
  for (const [key, value] of Object.entries(rest)) {
    eventHandlers.debug?.("loop", `Running for of loop in createDiscordenoRole function.`);

    const toggleBits = roleToggles[key as keyof typeof roleToggles];
    if (toggleBits) {
      bitfield |= value ? toggleBits : 0n;
      continue;
    }

    props[key] = createNewProp(ROLE_SNOWFLAKES.includes(key) ? (value ? snowflakeToBigint(value) : undefined) : value);
  }

  const role: DiscordenoRole = Object.create(baseRole, {
    ...props,
    botId: createNewProp(tags.botId ? snowflakeToBigint(tags.botId) : undefined),
    isNitroBoostRole: createNewProp("premiumSubscriber" in tags),
    integrationId: createNewProp(tags.integrationId ? snowflakeToBigint(tags.integrationId) : undefined),
    bitfield: createNewProp(bitfield),
  });

  return role;
}

export interface DiscordenoRole extends Omit<Role, "tags" | "id"> {
  /** The role id */
  id: bigint;
  /** The bot id that is associated with this role. */
  botId?: bigint;
  /** If this role is the nitro boost role. */
  isNitroBoostRole: boolean;
  /** The integration id that is associated with this role */
  integrationId: bigint;
  /** The roles guildId */
  guildId: bigint;
  /** Holds all the boolean toggles. */
  bitfield: bigint;

  // GETTERS

  /** The guild where this role is. If undefined, the guild is not cached */
  guild?: DiscordenoGuild;
  /** The hex color for this role. */
  hexColor: string;
  /** The cached members that have this role */
  members: Collection<bigint, DiscordenoMember>;
  /** The @ mention of the role in a string. */
  mention: string;

  // METHODS

  /** Delete the role */
  delete(): ReturnType<typeof deleteRole>;
  /** Edits the role */
  edit(options: CreateGuildRole): ReturnType<typeof editRole>;
  /** Checks if this role is higher than another role. */
  higherThanRole(roleId: bigint, position?: number): boolean;
  /** Checks if the role has a higher position than the given member */
  higherThanMember(memberId: bigint): Promise<boolean>;
  /** Convert to json friendly role with guild id */
  toJSON(): Role & { guildId: string };
}
