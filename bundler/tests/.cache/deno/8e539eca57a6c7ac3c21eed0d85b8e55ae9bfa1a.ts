// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/invites/invite_metadata.ts


import { Invite } from "./invite.ts";

/** https://discord.com/developers/docs/resources/invite#invite-metadata-object */
export interface InviteMetadata extends Invite {
  /** Number of times this invite has been used */
  uses: number;
  /** Max number of times this invite can be used */
  maxUses: number;
  /** Duration (in seconds) after which the invite expires */
  maxAge: number;
  /** Whether this invite only grants temporary membership */
  temporary: boolean;
  /** When this invite was created */
  createdAt: string;
}
