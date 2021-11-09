// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/invites/create_channel_invite.ts


import { DiscordInviteTargetTypes } from "./invite_target_types.ts";

export interface CreateChannelInvite {
  /** Duration of invite in seconds before expiry, or 0 for never. Between 0 and 604800 (7 days). Default: 86400 (24 hours) */
  maxAge?: number;
  /** Max number of users or 0 for unlimited. Between 0 and 100. Default: 0 */
  maxUses?: number;
  /** Whether this invite only grants temporary membership. Default: false */
  temporary?: boolean;
  /** If true, don't try to reuse simmilar invite (useful for creating many unique one time use invites). Default: false */
  unique?: boolean;
  /** The type of target for this voice channel invite */
  targetType?: DiscordInviteTargetTypes;
  /** The id of the user whose stream to display for this invite, required if `target_type` is 1, the user must be streaming in the channel */
  targetUserId?: string;
  /** The id of the embedded application to open for this invite, required if `target_type` is 2, the application must have the `EMBEDDED` flag */
  targetApplicationId?: string;
}
