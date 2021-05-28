// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/guild_banner_url.ts


import type { DiscordImageFormat } from "../../types/misc/image_format.ts";
import type { DiscordImageSize } from "../../types/misc/image_size.ts";
import { endpoints } from "../../util/constants.ts";
import { iconBigintToHash } from "../../util/hash.ts";
import { formatImageURL } from "../../util/utils.ts";

/** The full URL of the banner from Discords CDN. Undefined if no banner is set. */
export function guildBannerURL(
  id: bigint,
  options: {
    banner?: string | bigint;
    size?: DiscordImageSize;
    format?: DiscordImageFormat;
    animated?: boolean;
  }
) {
  return options.banner
    ? formatImageURL(
        endpoints.GUILD_BANNER(
          id,
          typeof options.banner === "string"
            ? options.banner
            : iconBigintToHash(options.banner, options.animated ?? true)
        ),
        options.size || 128,
        options.format
      )
    : undefined;
}
