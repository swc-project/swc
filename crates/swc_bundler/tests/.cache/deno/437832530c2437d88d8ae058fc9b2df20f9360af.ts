// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/modify_thread.ts


// TODO: add docs link
export interface ModifyThread {
  /** 2-100 character thread name */
  name?: string;
  /** Whether the thread is archived */
  archived?: boolean;
  /** Duration in minutes to automatically archive the thread after recent activity */
  autoArchiveDuration?: 60 | 1440 | 4320 | 10080;
  /** When a thread is locked, only users with `MANAGE_THREADS` can unarchive it */
  locked?: boolean;
  /** Amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the permission `MANAGE_MESSAGES`, `MANAGE_THREAD` or `MANAGE_CHANNEL` are unaffected */
  rateLimitPerUser?: number;
}
