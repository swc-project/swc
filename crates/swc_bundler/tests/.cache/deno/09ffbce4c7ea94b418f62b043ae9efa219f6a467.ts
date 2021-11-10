// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/process_rate_limited_paths.ts


import { eventHandlers } from "../bot.ts";
import { rest } from "./rest.ts";

/** This will create a infinite loop running in 1 seconds using tail recursion to keep rate limits clean. When a rate limit resets, this will remove it so the queue can proceed. */
export function processRateLimitedPaths() {
  const now = Date.now();

  for (const [key, value] of rest.ratelimitedPaths.entries()) {
    rest.eventHandlers.debug?.("loop", `Running forEach loop in process_rate_limited_paths file.`);
    // IF THE TIME HAS NOT REACHED CANCEL
    if (value.resetTimestamp > now) continue;

    // RATE LIMIT IS OVER, DELETE THE RATE LIMITER
    rest.ratelimitedPaths.delete(key);
    // IF IT WAS GLOBAL ALSO MARK THE GLOBAL VALUE AS FALSE
    if (key === "global") rest.globallyRateLimited = false;
  }

  // ALL PATHS ARE CLEARED CAN CANCEL OUT!
  if (!rest.ratelimitedPaths.size) {
    rest.processingRateLimitedPaths = false;
    return;
  } else {
    rest.processingRateLimitedPaths = true;
    // RECHECK IN 1 SECOND
    setTimeout(() => {
      eventHandlers.debug?.("loop", `Running setTimeout in processRateLimitedPaths function.`);
      processRateLimitedPaths();
    }, 1000);
  }
}
