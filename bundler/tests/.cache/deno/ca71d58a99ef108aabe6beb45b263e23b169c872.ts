// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/guild_splash_url.ts


import type { DiscordImageFormat } from "../../types/misc/image_format.ts";
import type { DiscordImageSize } from "../../types/misc/image_size.ts";
import { endpoints } from "../../util/constants.ts";
import { iconBigintToHash } from "../../util/hash.ts";
import { formatImageURL } from "../../util/utils.ts";

/** The full URL of the splash from Discords CDN. Undefined if no splash is set. */
export function guildSplashURL(
  id: bigint,
  options: {
    splash?: string | bigint;
    size?: DiscordImageSize;
    format?: DiscordImageFormat;
    animated?: boolean;
  }
) {
  return options.splash
    ? formatImageURL(
        endpoints.GUILD_SPLASH(
          id,
          typeof options.splash === "string"
            ? options.splash
            : iconBigintToHash(options.splash, options.animated ?? true)
        ),
        options.size || 128,
        options.format
      )
    : undefined;
}
