// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/list_active_threads.ts


import { Channel } from "../channel.ts";
import { ThreadMember } from "./thread_member.ts";

// TODO: add docs link
export interface ListActiveThreads {
  /** The active threads */
  threads: Channel[];
  /** A thread member object for each returned thread the current user has joined */
  members: ThreadMember[];
  /** Whether there are potentially additional threads that could be returned on subsequent call */
  hasMore: boolean;
}
