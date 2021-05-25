// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/check_rate_limits.ts


import { rest } from "./rest.ts";

/** Check the rate limits for a url or a bucket. */
export function checkRateLimits(url: string) {
  const ratelimited = rest.ratelimitedPaths.get(url);
  const global = rest.ratelimitedPaths.get("global");
  const now = Date.now();

  if (ratelimited && now < ratelimited.resetTimestamp) {
    return ratelimited.resetTimestamp - now;
  }
  if (global && now < global.resetTimestamp) {
    return global.resetTimestamp - now;
  }

  return false;
}
