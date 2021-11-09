// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_prune_count.ts


import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { GetGuildPruneCountQuery } from "../../types/guilds/get_guild_prune_count.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { snakelize } from "../../util/utils.ts";

/** Check how many members would be removed from the server in a prune operation. Requires the KICK_MEMBERS permission */
export async function getPruneCount(guildId: bigint, options?: GetGuildPruneCountQuery) {
  if (options?.days && options.days < 1) throw new Error(Errors.PRUNE_MIN_DAYS);
  if (options?.days && options.days > 30) {
    throw new Error(Errors.PRUNE_MAX_DAYS);
  }

  await requireBotGuildPermissions(guildId, ["KICK_MEMBERS"]);

  const result = await rest.runMethod("get", endpoints.GUILD_PRUNE(guildId), snakelize(options ?? {}));

  return result.pruned as number;
}
