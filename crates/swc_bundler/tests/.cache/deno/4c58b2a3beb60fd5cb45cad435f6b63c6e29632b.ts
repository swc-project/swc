// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/gateway/session_start_limit.ts


/** https://discord.com/developers/docs/topics/gateway#session-start-limit-object */
export interface SessionStartLimit {
  /** The total number of session starts the current user is allowed */
  total: number;
  /** The remaining number of session starts the current user is allowed */
  remaining: number;
  /** The number of milliseconds after which the limit resets */
  resetAfter: number;
  /** The number of identify requests allowed per 5 seconds */
  maxConcurrency: number;
}
