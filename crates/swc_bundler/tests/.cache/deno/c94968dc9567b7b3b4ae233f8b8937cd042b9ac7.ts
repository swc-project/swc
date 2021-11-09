// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/members/avatar_url.ts


import type { DiscordImageFormat } from "../../types/misc/image_format.ts";
import type { DiscordImageSize } from "../../types/misc/image_size.ts";
import { endpoints } from "../../util/constants.ts";
import { iconBigintToHash } from "../../util/hash.ts";
import { formatImageURL } from "../../util/utils.ts";

/** The users custom avatar or the default avatar if you don't have a member object. */
export function avatarURL(
  userId: bigint,
  discriminator: bigint,
  options: {
    avatar?: string | bigint;
    size?: DiscordImageSize;
    format?: DiscordImageFormat;
    animated?: boolean;
  }
) {
  return options.avatar
    ? formatImageURL(
        endpoints.USER_AVATAR(
          userId,
          typeof options.avatar === "string"
            ? options.avatar
            : iconBigintToHash(options.avatar, options.animated ?? true)
        ),
        options.size || 128,
        options.format
      )
    : endpoints.USER_DEFAULT_AVATAR(Number(discriminator) % 5);
}
