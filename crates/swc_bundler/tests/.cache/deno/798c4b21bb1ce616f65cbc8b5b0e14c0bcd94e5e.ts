// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/guild_icon_url.ts


import type { DiscordImageFormat } from "../../types/misc/image_format.ts";
import type { DiscordImageSize } from "../../types/misc/image_size.ts";
import { endpoints } from "../../util/constants.ts";
import { iconBigintToHash } from "../../util/hash.ts";
import { formatImageURL } from "../../util/utils.ts";

/** The full URL of the icon from Discords CDN. Undefined when no icon is set. */
export function guildIconURL(
  id: bigint,
  options: {
    icon?: string | bigint;
    size?: DiscordImageSize;
    format?: DiscordImageFormat;
    animated?: boolean;
  }
) {
  return options.icon
    ? formatImageURL(
        endpoints.GUILD_ICON(
          id,
          typeof options.icon === "string" ? options.icon : iconBigintToHash(options.icon, options.animated ?? true)
        ),
        options.size || 128,
        options.format
      )
    : undefined;
}
