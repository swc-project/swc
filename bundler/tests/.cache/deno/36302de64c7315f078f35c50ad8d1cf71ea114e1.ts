// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/invites/get_invite.ts


import { rest } from "../../rest/rest.ts";
import { GetInvite } from "../../types/invites/get_invite.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { endpoints } from "../../util/constants.ts";
import { snakelize } from "../../util/utils.ts";

/** Returns an invite for the given code or throws an error if the invite doesn't exists. */
export async function getInvite(inviteCode: string, options?: GetInvite) {
  return await rest.runMethod<InviteMetadata>("get", endpoints.INVITE(inviteCode), snakelize(options ?? {}));
}
