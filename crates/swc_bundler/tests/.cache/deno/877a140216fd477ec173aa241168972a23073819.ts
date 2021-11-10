// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/cache_members.ts


import { eventHandlers } from "../bot.ts";
import { cacheHandlers } from "../cache.ts";
import { structures } from "../structures/mod.ts";
import { GuildMemberWithUser } from "../types/members/guild_member.ts";

const guildMemberQueue = new Map<bigint, { members: GuildMemberWithUser[]; resolve?: (value?: unknown) => void }>();
let processingQueue = false;

/** Cache all guild members without need to worry about overwriting something. */
// deno-lint-ignore require-await
export async function cacheMembers(guildId: bigint, members: GuildMemberWithUser[]) {
  if (!members.length) return;

  return new Promise((resolve) => {
    guildMemberQueue.set(guildId, { members, resolve });
    startQueue();
  });
}

async function startQueue() {
  if (processingQueue) return;

  processingQueue = true;

  while (guildMemberQueue.size) {
    eventHandlers.debug?.("loop", "Running whille loop in cache_members file.");
    const [guildId, queue]: [bigint, { members: GuildMemberWithUser[]; resolve: (value?: unknown) => void }] =
      guildMemberQueue.entries().next().value;

    await Promise.allSettled([
      queue.members.map(async (member) => {
        const discordenoMember = await structures.createDiscordenoMember(member, guildId);

        await cacheHandlers.set("members", discordenoMember.id, discordenoMember);
      }),
    ]);

    queue.resolve?.();

    guildMemberQueue.delete(guildId);
  }

  processingQueue = false;
}
