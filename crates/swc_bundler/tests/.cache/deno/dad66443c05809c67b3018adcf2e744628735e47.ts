// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/discovery/edit_discovery.ts


import { rest } from "../../rest/rest.ts";
import type { DiscoveryMetadata } from "../../types/discovery/discovery_metadata.ts";
import type { ModifyGuildDiscoveryMetadata } from "../../types/discovery/modify_guild_discovery_metadata.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { snakelize } from "../../util/utils.ts";

/** Modify the discovery metadata for the guild. Requires the MANAGE_GUILD permission. Returns the updated discovery metadata object on success. */
export async function editDiscovery(guildId: bigint, data: ModifyGuildDiscoveryMetadata) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  return await rest.runMethod<DiscoveryMetadata>("patch", endpoints.DISCOVERY_MODIFY(guildId), snakelize(data));
}
