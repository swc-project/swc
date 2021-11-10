// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/start_thread.ts


// TODO: add docs link
export interface StartThread {
  /** 2-100 character thread name */
  name: string;
  /** Duration in minutes to automatically archive the thread after recent activity */
  autoArchiveDuration: 60 | 1440 | 4320 | 10080;
}
