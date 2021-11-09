// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/list_public_archived_threads.ts


// TODO: add docs link
export interface ListPublicArchivedThreads {
  // TODO: convert unix to ISO9601 timestamp
  /** Returns threads before this timestamp. UNIX or ISO8601 timestamp */
  before?: number | string;
  /** Optional maximum number of threads to return */
  limit?: number;
}
