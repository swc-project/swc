// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/invites/get_invites.ts


import { rest } from "../../rest/rest.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Get all the invites for this guild. Requires MANAGE_GUILD permission */
export async function getInvites(guildId: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_GUILD"]);

  const result = await rest.runMethod<InviteMetadata[]>("get", endpoints.GUILD_INVITES(guildId));

  return new Collection(result.map((invite) => [invite.code, invite]));
}
