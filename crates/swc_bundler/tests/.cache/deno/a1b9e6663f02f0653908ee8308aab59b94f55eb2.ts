// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/thread_metadata.ts


export interface ThreadMetadata {
  /** Whether the thread is archived */
  archived: boolean;
  /** Id of the user that last archived or unarchived the thread */
  archiverId?: string;
  /** Duration in minutes to automatically archive the thread after recent activity */
  autoArchiveDuration: 60 | 1440 | 4320 | 10080;
  // TODO(threads): channel struct should convert this to a unixx
  /** Timestamp when the thread's archive status was last changed, used for calculating recent activity */
  archiveTimestamp: string;
  /** When a thread is locked, only users with `MANAGE_THREADS` can unarchive it */
  locked?: boolean;
}
