// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/invites/invite.ts


import { Channel } from "../channels/channel.ts";
import { Guild } from "../guilds/guild.ts";
import { Application } from "../applications/application.ts";
import { User } from "../users/user.ts";
import { DiscordTargetTypes } from "./target_types.ts";

/** https://discord.com/developers/docs/resources/invite#invite-object */
export interface Invite {
  /** The invite code (unique Id) */
  code: string;
  /** The guild this invite is for */
  guild?: Partial<Guild>;
  /** The channel this invite is for */
  channel: Partial<Channel>;
  /** The user who created the invite */
  inviter?: User;
  /** The type of target for this voice channel invite */
  targetType?: DiscordTargetTypes;
  /** The target user for this invite */
  targetUser?: User;
  /** The embedded application to open for this voice channel embedded application invite */
  targetApplication?: Partial<Application>;
  /** Approximate count of online members (only present when target_user is set) */
  approximatePresenceCount?: number;
  /** Approximate count of total members */
  approximateMemberCount?: number;
  /** The expiration date of this invite, returned from the `GET /invites/<code>` endpoint when `with_expiration` is `true` */
  expiresAt?: string | null;
}
