// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/emojis/create_emoji.ts


import { rest } from "../../rest/rest.ts";
import { CreateGuildEmoji } from "../../types/emojis/create_guild_emoji.ts";
import type { Emoji } from "../../types/emojis/emoji.ts";
import { snowflakeToBigint } from "../../util/bigint.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";
import { urlToBase64 } from "../../util/utils.ts";

/** Create an emoji in the server. Emojis and animated emojis have a maximum file size of 256kb. Attempting to upload an emoji larger than this limit will fail and return 400 Bad Request and an error message, but not a JSON status code. If a URL is provided to the image parameter, Discordeno will automatically convert it to a base64 string internally. */
export async function createEmoji(guildId: bigint, name: string, image: string, options: CreateGuildEmoji) {
  await requireBotGuildPermissions(guildId, ["MANAGE_EMOJIS"]);

  if (image && !image.startsWith("data:image/")) {
    image = await urlToBase64(image);
  }

  const emoji = await rest.runMethod<Emoji>("post", endpoints.GUILD_EMOJIS(guildId), {
    ...options,
    name,
    image,
  });

  return {
    ...emoji,
    id: snowflakeToBigint(emoji.id!),
  };
}
