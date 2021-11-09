// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/fetch_members.ts


import { cache } from "../../cache.ts";
import { DiscordenoMember } from "../../structures/member.ts";
import { DiscordGatewayOpcodes } from "../../types/codes/gateway_opcodes.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { DiscordGatewayIntents } from "../../types/gateway/gateway_intents.ts";
import type { RequestGuildMembers } from "../../types/members/request_guild_members.ts";
import { Collection } from "../../util/collection.ts";
import { ws } from "../../ws/ws.ts";

/**
 * ⚠️ BEGINNER DEVS!! YOU SHOULD ALMOST NEVER NEED THIS AND YOU CAN GET FROM cache.members.get()
 *
 * ADVANCED:
 * Highly recommended to use this function to fetch members instead of getMember from REST.
 * REST: 50/s global(across all shards) rate limit with ALL requests this included
 * GW(this function): 120/m(PER shard) rate limit. Meaning if you have 8 shards your limit is now 960/m.
 */
export function fetchMembers(guildId: bigint, shardId: number, options?: Omit<RequestGuildMembers, "guildId">) {
  // You can request 1 member without the intent
  if ((!options?.limit || options.limit > 1) && !(ws.identifyPayload.intents & DiscordGatewayIntents.GuildMembers)) {
    throw new Error(Errors.MISSING_INTENT_GUILD_MEMBERS);
  }

  if (options?.userIds?.length) {
    options.limit = options.userIds.length;
  }

  return new Promise((resolve) => {
    const nonce = `${guildId}-${Date.now()}`;
    cache.fetchAllMembersProcessingRequests.set(nonce, resolve);

    ws.sendShardMessage(shardId, {
      op: DiscordGatewayOpcodes.RequestGuildMembers,
      d: {
        guild_id: guildId,
        // If a query is provided use it, OR if a limit is NOT provided use ""
        query: options?.query || (options?.limit ? undefined : ""),
        limit: options?.limit || 0,
        presences: options?.presences || false,
        user_ids: options?.userIds,
        nonce,
      },
    });
  }) as Promise<Collection<bigint, DiscordenoMember>>;
}
