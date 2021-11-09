// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_bans.ts


import { rest } from "../../rest/rest.ts";
import type { Ban } from "../../types/guilds/ban.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Returns a list of ban objects for the users banned from this guild. Requires the BAN_MEMBERS permission. */
export async function getBans(guildId: bigint) {
  await requireBotGuildPermissions(guildId, ["BAN_MEMBERS"]);

  const results = await rest.runMethod<Ban[]>("get", endpoints.GUILD_BANS(guildId));

  return new Collection<bigint, Ban>(results.map((res) => [snowflakeToBigint(res.user.id), res]));
}
