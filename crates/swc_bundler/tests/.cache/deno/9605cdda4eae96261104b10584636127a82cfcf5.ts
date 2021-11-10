// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/guilds/get_voice_regions.ts


import { rest } from "../../rest/rest.ts";
import type { VoiceRegion } from "../../types/voice/voice_region.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";

/** Returns a list of voice region objects for the guild. Unlike the similar /voice route, this returns VIP servers when the guild is VIP-enabled. */
export async function getVoiceRegions(guildId: bigint) {
  const result = await rest.runMethod<VoiceRegion[]>("get", endpoints.GUILD_REGIONS(guildId));

  return new Collection<string, VoiceRegion>(result.map((region) => [region.id, region]));
}
