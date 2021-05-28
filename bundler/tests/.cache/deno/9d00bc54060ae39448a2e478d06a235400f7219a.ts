// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/invites/get_channel_invites.ts


import { rest } from "../../rest/rest.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Gets the invites for this channel. Requires MANAGE_CHANNEL */
export async function getChannelInvites(channelId: bigint) {
  await requireBotChannelPermissions(channelId, ["MANAGE_CHANNELS"]);

  const result = await rest.runMethod<InviteMetadata[]>("get", endpoints.CHANNEL_INVITES(channelId));

  return new Collection(result.map((invite) => [invite.code, invite]));
}
