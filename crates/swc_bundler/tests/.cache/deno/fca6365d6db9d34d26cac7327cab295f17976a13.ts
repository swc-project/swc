// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/activity/client_status.ts


/** https://discord.com/developers/docs/topics/gateway#client-status-object */
export interface ClientStatus {
  /** The user's status set for an active desktop (Windows, Linux, Mac) application session */
  desktop?: string;
  /** The user's status set for an active mobile (iOS, Android) application session */
  mobile?: string;
  /** The user's status set for an active web (browser, bot account) application session */
  web?: string;
}
