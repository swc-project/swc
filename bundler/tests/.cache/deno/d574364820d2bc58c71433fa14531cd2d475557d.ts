// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/prune_members.ts


import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { BeginGuildPrune } from "../../types/guilds/begin_guild_prune.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { snakelize } from "../../util/utils.ts";

/**
 * Begin a prune operation. Requires the KICK_MEMBERS permission. Returns an object with one 'pruned' key indicating the number of members that were removed in the prune operation. For large guilds it's recommended to set the computePruneCount option to false, forcing 'pruned' to null. Fires multiple Guild Member Remove Gateway events.
 *
 * By default, prune will not remove users with roles. You can optionally include specific roles in your prune by providing the roles (resolved to include_roles internally) parameter. Any inactive user that has a subset of the provided role(s) will be included in the prune and users with additional roles will not.
 */
export async function pruneMembers(guildId: bigint, options: BeginGuildPrune) {
  if (options.days && options.days < 1) throw new Error(Errors.PRUNE_MIN_DAYS);
  if (options.days && options.days > 30) throw new Error(Errors.PRUNE_MAX_DAYS);

  await requireBotGuildPermissions(guildId, ["KICK_MEMBERS"]);

  const result = await rest.runMethod<{ pruned: number }>("post", endpoints.GUILD_PRUNE(guildId), snakelize(options));

  return result.pruned;
}
