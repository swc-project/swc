// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/discovery/valid_discovery_term.ts


import { rest } from "../../rest/rest.ts";
import type { ValidateDiscoverySearchTerm } from "../../types/discovery/validate_discovery_search_term.ts";
import { endpoints } from "../../util/constants.ts";

export async function validDiscoveryTerm(term: string) {
  const result = await rest.runMethod<ValidateDiscoverySearchTerm>("get", endpoints.DISCOVERY_VALID_TERM, { term });

  return result.valid;
}
