// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/thread_member.ts


export interface ThreadMember {
  /** The id of the thread */
  id: string;
  /** The id of the user */
  userId: string;
  /** The time the current user last joined the thread */
  joinTimestamp: string;
  /** Any user-thread settings, currently only used for notifications */
  flags: number;
}
