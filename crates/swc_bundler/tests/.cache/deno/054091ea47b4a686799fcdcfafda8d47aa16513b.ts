// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/process_request_headers.ts


import { rest } from "./rest.ts";

/** Processes the rate limit headers and determines if it needs to be ratelimited and returns the bucket id if available */
export function processRequestHeaders(url: string, headers: Headers) {
  let ratelimited = false;

  // GET ALL NECESSARY HEADERS
  const remaining = headers.get("x-ratelimit-remaining");
  const retryAfter = headers.get("x-ratelimit-reset-after");
  const reset = Date.now() + Number(retryAfter) * 1000;
  const global = headers.get("x-ratelimit-global");
  // undefined override null needed for typings
  const bucketId = headers.get("x-ratelimit-bucket") || undefined;

  // IF THERE IS NO REMAINING RATE LIMIT, MARK IT AS RATE LIMITED
  if (remaining === "0") {
    ratelimited = true;

    // SAVE THE URL AS LIMITED, IMPORTANT FOR NEW REQUESTS BY USER WITHOUT BUCKET
    rest.ratelimitedPaths.set(url, {
      url,
      resetTimestamp: reset,
      bucketId,
    });

    // SAVE THE BUCKET AS LIMITED SINCE DIFFERENT URLS MAY SHARE A BUCKET
    if (bucketId) {
      rest.ratelimitedPaths.set(bucketId, {
        url,
        resetTimestamp: reset,
        bucketId,
      });
    }
  }

  // IF THERE IS NO REMAINING GLOBAL LIMIT, MARK IT RATE LIMITED GLOBALLY
  if (global) {
    const retryAfter = headers.get("retry-after");
    const globalReset = Date.now() + Number(retryAfter) * 1000;
    rest.eventHandlers.globallyRateLimited(url, globalReset);
    rest.globallyRateLimited = true;
    ratelimited = true;

    rest.ratelimitedPaths.set("global", {
      url: "global",
      resetTimestamp: globalReset,
      bucketId,
    });

    if (bucketId) {
      rest.ratelimitedPaths.set(bucketId, {
        url: "global",
        resetTimestamp: globalReset,
        bucketId,
      });
    }
  }

  if (ratelimited && !rest.processingRateLimitedPaths) {
    rest.processRateLimitedPaths();
  }
  return ratelimited ? bucketId : undefined;
}
