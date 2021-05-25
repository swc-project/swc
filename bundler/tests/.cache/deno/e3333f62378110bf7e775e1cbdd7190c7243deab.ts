// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/edit_member.ts


import { cacheHandlers } from "../../cache.ts";
import { rest } from "../../rest/rest.ts";
import { structures } from "../../structures/mod.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { ModifyGuildMember } from "../../types/guilds/modify_guild_member.ts";
import type { GuildMemberWithUser } from "../../types/members/guild_member.ts";
import type { PermissionStrings } from "../../types/permissions/permission_strings.ts";
import { bigintToSnowflake } from "../../util/bigint.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotChannelPermissions, requireBotGuildPermissions } from "../../util/permissions.ts";
import { snakelize } from "../../util/utils.ts";

/** Edit the member */
export async function editMember(guildId: bigint, memberId: bigint, options: ModifyGuildMember) {
  const requiredPerms: Set<PermissionStrings> = new Set();

  if (options.nick) {
    if (options.nick.length > 32) {
      throw new Error(Errors.NICKNAMES_MAX_LENGTH);
    }
    requiredPerms.add("MANAGE_NICKNAMES");
  }

  if (options.roles) requiredPerms.add("MANAGE_ROLES");

  if (
    typeof options.mute !== "undefined" ||
    typeof options.deaf !== "undefined" ||
    typeof options.channelId !== "undefined" ||
    "null"
  ) {
    const memberVoiceState = (await cacheHandlers.get("guilds", guildId))?.voiceStates.get(memberId);

    if (!memberVoiceState?.channelId) {
      throw new Error(Errors.MEMBER_NOT_IN_VOICE_CHANNEL);
    }

    if (typeof options.mute !== "undefined") {
      requiredPerms.add("MUTE_MEMBERS");
    }

    if (typeof options.deaf !== "undefined") {
      requiredPerms.add("DEAFEN_MEMBERS");
    }

    if (options.channelId) {
      const requiredVoicePerms: Set<PermissionStrings> = new Set(["CONNECT", "MOVE_MEMBERS"]);
      if (memberVoiceState) {
        await requireBotChannelPermissions(memberVoiceState?.channelId, [...requiredVoicePerms]);
      }
      await requireBotChannelPermissions(options.channelId, [...requiredVoicePerms]);
    }
  }

  await requireBotGuildPermissions(guildId, [...requiredPerms]);

  const result = await rest.runMethod<GuildMemberWithUser>(
    "patch",
    endpoints.GUILD_MEMBER(guildId, memberId),
    snakelize({
      ...options,
      channelId: options.channelId ? bigintToSnowflake(options.channelId) : undefined,
    }) as ModifyGuildMember
  );

  const member = await structures.createDiscordenoMember(result, guildId);

  return member;
}
