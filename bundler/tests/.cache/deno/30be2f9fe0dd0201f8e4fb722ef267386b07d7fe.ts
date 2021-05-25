// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/move_member.ts


import { editMember } from "./edit_member.ts";

/**
 * Move a member from a voice channel to another.
 * @param guildId the id of the guild which the channel exists in
 * @param memberId the id of the member to move.
 * @param channelId id of channel to move user to (if they are connected to voice)
 */
export function moveMember(guildId: bigint, memberId: bigint, channelId: bigint) {
  return editMember(guildId, memberId, { channelId });
}
