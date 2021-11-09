// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/disconnect_member.ts


import { editMember } from "./edit_member.ts";

/** Kicks a member from a voice channel */
export function disconnectMember(guildId: bigint, memberId: bigint) {
  return editMember(guildId, memberId, { channelId: null });
}
