// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_vainty_url.ts


import { rest } from "../../rest/rest.ts";
import type { InviteMetadata } from "../../types/invites/invite_metadata.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns the code and uses of the vanity url for this server if it is enabled else `code` will be null. Requires the `MANAGE_GUILD` permission. */
export async function getVanityURL(guildId: bigint) {
  return await rest.runMethod<
    | (Partial<InviteMetadata> & Pick<InviteMetadata, "uses" | "code">)
    | {
        code: null;
      }
  >("get", endpoints.GUILD_VANITY_URL(guildId));
}
