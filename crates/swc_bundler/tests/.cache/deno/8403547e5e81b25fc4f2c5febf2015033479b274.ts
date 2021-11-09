// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/invites/delete_invite.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { endpoints } from "../../util/constants.ts";
import { botHasChannelPermissions, requireBotGuildPermissions } from "../../util/permissions.ts";

/** Deletes an invite for the given code. Requires `MANAGE_CHANNELS` or `MANAGE_GUILD` permission */
export async function deleteInvite(channelId: bigint, inviteCode: string) {
  const channel = await cacheHandlers.get("channels", channelId);
  if (channel) {
    const hasPerm = await botHasChannelPermissions(channel, ["MANAGE_CHANNELS"]);

    if (!hasPerm) {
      await requireBotGuildPermissions(channel.guildId, ["MANAGE_GUILD"]);
    }
  }

  return await rest.runMethod<InviteMetadata>("delete", endpoints.INVITE(inviteCode));
}
