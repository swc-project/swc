// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/cache.ts


// deno-lint-ignore-file require-await no-explicit-any prefer-const
import type { DiscordenoChannel } from "./structures/channel.ts";
import type { DiscordenoGuild } from "./structures/guild.ts";
import type { DiscordenoMember } from "./structures/member.ts";
import type { DiscordenoMessage } from "./structures/message.ts";
import type { PresenceUpdate } from "./types/activity/presence_update.ts";
import type { Emoji } from "./types/emojis/emoji.ts";
import { Collection } from "./util/collection.ts";

export const cache = {
  isReady: false,
  /** All of the guild objects the bot has access to, mapped by their Ids */
  guilds: new Collection<bigint, DiscordenoGuild>(),
  /** All of the channel objects the bot has access to, mapped by their Ids */
  channels: new Collection<bigint, DiscordenoChannel>(),
  /** All of the message objects the bot has cached since the bot acquired `READY` state, mapped by their Ids */
  messages: new Collection<bigint, DiscordenoMessage>(),
  /** All of the member objects that have been cached since the bot acquired `READY` state, mapped by their Ids */
  members: new Collection<bigint, DiscordenoMember>(),
  /** All of the unavailable guilds, mapped by their Ids (id, timestamp) */
  unavailableGuilds: new Collection<bigint, number>(),
  /** All of the presence update objects received in PRESENCE_UPDATE gateway event, mapped by their user Id */
  presences: new Collection<bigint, PresenceUpdate>(),
  fetchAllMembersProcessingRequests: new Collection<
    string,
    (value: Collection<bigint, DiscordenoMember> | PromiseLike<Collection<bigint, DiscordenoMember>>) => void
  >(),
  executedSlashCommands: new Set<string>(),
  get emojis() {
    return new Collection<bigint, Emoji>(
      this.guilds.reduce((a, b) => [...a, ...b.emojis.map((e) => [e.id, e])], [] as any[])
    );
  },
};

export let cacheHandlers = {
  /** Deletes all items from the cache */
  async clear(table: TableName) {
    return cache[table].clear();
  },
  /** Deletes 1 item from cache using the key */
  async delete(table: TableName, key: bigint) {
    return cache[table].delete(key);
  },
  /** Check if something exists in cache with a key */
  async has(table: TableName, key: bigint) {
    return cache[table].has(key);
  },

  /** Get the number of key-value pairs */
  async size(table: TableName) {
    return cache[table].size;
  },

  // Done differently to have overloads
  /** Add a key value pair to the cache */
  set,
  /** Get the value from the cache using its key */
  get,
  /** Run a function on all items in this cache */
  forEach,
  /** Allows you to filter our all items in this cache. */
  filter,
};

export type TableName = "guilds" | "unavailableGuilds" | "channels" | "messages" | "members" | "presences";

function set(table: "guilds", key: bigint, value: DiscordenoGuild): Promise<Collection<bigint, DiscordenoGuild>>;
function set(table: "channels", key: bigint, value: DiscordenoChannel): Promise<Collection<bigint, DiscordenoChannel>>;
function set(table: "messages", key: bigint, value: DiscordenoMessage): Promise<Collection<bigint, DiscordenoMessage>>;
function set(table: "members", key: bigint, value: DiscordenoMember): Promise<Collection<bigint, DiscordenoMember>>;
function set(table: "presences", key: bigint, value: PresenceUpdate): Promise<Collection<bigint, PresenceUpdate>>;
function set(table: "unavailableGuilds", key: bigint, value: number): Promise<Collection<bigint, number>>;
async function set(table: TableName, key: bigint, value: any) {
  return cache[table].set(key, value);
}

function get(table: "guilds", key: bigint): Promise<DiscordenoGuild | undefined>;
function get(table: "channels", key: bigint): Promise<DiscordenoChannel | undefined>;
function get(table: "messages", key: bigint): Promise<DiscordenoMessage | undefined>;
function get(table: "members", key: bigint): Promise<DiscordenoMember | undefined>;
function get(table: "presences", key: bigint): Promise<PresenceUpdate | undefined>;
function get(table: "unavailableGuilds", key: bigint): Promise<number | undefined>;
async function get(table: TableName, key: bigint) {
  return cache[table].get(key);
}

function forEach(
  table: "guilds",
  callback: (value: DiscordenoGuild, key: bigint, map: Map<bigint, DiscordenoGuild>) => unknown
): void;
function forEach(
  table: "unavailableGuilds",
  callback: (value: number, key: bigint, map: Map<bigint, number>) => unknown
): void;
function forEach(
  table: "channels",
  callback: (value: DiscordenoChannel, key: bigint, map: Map<bigint, DiscordenoChannel>) => unknown
): void;
function forEach(
  table: "messages",
  callback: (value: DiscordenoMessage, key: bigint, map: Map<bigint, DiscordenoMessage>) => unknown
): void;
function forEach(
  table: "members",
  callback: (value: DiscordenoMember, key: bigint, map: Map<bigint, DiscordenoMember>) => unknown
): void;
function forEach(table: TableName, callback: (value: any, key: bigint, map: Map<bigint, any>) => unknown) {
  return cache[table].forEach(callback);
}

function filter(
  table: "guilds",
  callback: (value: DiscordenoGuild, key: bigint) => boolean
): Promise<Collection<bigint, DiscordenoGuild>>;
function filter(
  table: "unavailableGuilds",
  callback: (value: number, key: bigint) => boolean
): Promise<Collection<bigint, number>>;
function filter(
  table: "channels",
  callback: (value: DiscordenoChannel, key: bigint) => boolean
): Promise<Collection<bigint, DiscordenoChannel>>;
function filter(
  table: "messages",
  callback: (value: DiscordenoMessage, key: bigint) => boolean
): Promise<Collection<bigint, DiscordenoMessage>>;
function filter(
  table: "members",
  callback: (value: DiscordenoMember, key: bigint) => boolean
): Promise<Collection<bigint, DiscordenoMember>>;
async function filter(table: TableName, callback: (value: any, key: bigint) => boolean) {
  return cache[table].filter(callback);
}
