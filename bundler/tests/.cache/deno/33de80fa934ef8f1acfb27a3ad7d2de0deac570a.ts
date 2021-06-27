// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/invites/create_invite.ts


import { rest } from "../../rest/rest.ts";
import type { CreateChannelInvite } from "../../types/invites/create_channel_invite.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions } from "../../util/permissions.ts";

/** Creates a new invite for this channel. Requires CREATE_INSTANT_INVITE */
export async function createInvite(channelId: bigint, options: CreateChannelInvite = {}) {
  await requireBotChannelPermissions(channelId, ["CREATE_INSTANT_INVITE"]);

  if (options.maxAge && (options.maxAge < 0 || options.maxAge > 604800)) {
    throw new Error(Errors.INVITE_MAX_AGE_INVALID);
  }
  if (options.maxUses && (options.maxUses < 0 || options.maxUses > 100)) {
    throw new Error(Errors.INVITE_MAX_USES_INVALID);
  }

  return await rest.runMethod<InviteMetadata>("post", endpoints.CHANNEL_INVITES(channelId), options);
}
