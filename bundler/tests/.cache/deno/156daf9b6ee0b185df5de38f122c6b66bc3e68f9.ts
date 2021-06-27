// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/edit_bot_nickname.ts


import { rest } from "../../rest/rest.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Edit the nickname of the bot in this guild */
export async function editBotNickname(guildId: bigint, nickname: string | null) {
  await requireBotGuildPermissions(guildId, ["CHANGE_NICKNAME"]);

  const response = await rest.runMethod<{ nick: string }>("patch", endpoints.USER_NICK(guildId), {
    nick: nickname,
  });

  return response.nick;
}
