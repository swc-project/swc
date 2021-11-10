// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/presence_update.ts


import { User } from "../users/user.ts";
import { Activity } from "./activity.ts";
import { ClientStatus } from "./client_status.ts";

/** https://discord.com/developers/docs/topics/gateway#presence-update */
export interface PresenceUpdate {
  /** The user presence is being updated for */
  user: User;
  /** id of the guild */
  guildId: string;
  /** Either "idle", "dnd", "online", or "offline" */
  status: "idle" | "dnd" | "online" | "offline";
  /** User's current activities */
  activities: Activity[];
  /** User's platform-dependent status */
  clientStatus: ClientStatus;
}
