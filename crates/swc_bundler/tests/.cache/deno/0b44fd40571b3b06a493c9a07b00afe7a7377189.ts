// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/messages/message_activity.ts


import { DiscordMessageActivityTypes } from "./message_activity_types.ts";

/** https://discord.com/developers/docs/resources/channel#message-object-message-activity-structure */
export interface MessageActivity {
  /** Type of message activity */
  type: DiscordMessageActivityTypes;
  /** `party_id` from a Rich Presence event */
  partyId?: string;
}
