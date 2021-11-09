// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/misc/edit_bot_profile.ts


import { rest } from "../../rest/rest.ts";
import { Errors } from "../../types/discordeno/errors.ts";
import type { User } from "../../types/users/user.ts";
import { endpoints } from "../../util/constants.ts";
import { urlToBase64 } from "../../util/utils.ts";

/** Modifies the bot's username or avatar.
 * NOTE: username: if changed may cause the bot's discriminator to be randomized.
 */
export async function editBotProfile(username?: string, botAvatarURL?: string) {
  // Nothing was edited
  if (!username && !botAvatarURL) return;
  // Check username requirements if username was provided
  if (username) {
    if (username.length > 32) {
      throw new Error(Errors.USERNAME_MAX_LENGTH);
    }
    if (username.length < 2) {
      throw new Error(Errors.USERNAME_MIN_LENGTH);
    }
    if (["@", "#", ":", "```"].some((char) => username.includes(char))) {
      throw new Error(Errors.USERNAME_INVALID_CHARACTER);
    }
    if (["discordtag", "everyone", "here"].includes(username)) {
      throw new Error(Errors.USERNAME_INVALID_USERNAME);
    }
  }

  const avatar = botAvatarURL ? await urlToBase64(botAvatarURL) : undefined;

  return await rest.runMethod<User>("patch", endpoints.USER_BOT, {
    username: username?.trim(),
    avatar,
  });
}
