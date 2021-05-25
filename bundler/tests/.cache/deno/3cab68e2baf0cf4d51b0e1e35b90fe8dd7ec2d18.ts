// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/channels/threads/thread_members_update.ts


import { ThreadMember } from "./thread_member.ts";

// TODO: add docs link
export interface ThreadMembersUpdate {
  /** The id of the thread */
  id: string;
  /** The id of the guild */
  guildId: string;
  /** The approximate number of members in the thread, capped at 50 */
  memberCount: number;
  /** The users who were added to the thread */
  addedMembers?: ThreadMember[];
  /** The id of the users who were removed from the thread */
  removedMemberIds?: string[];
}
