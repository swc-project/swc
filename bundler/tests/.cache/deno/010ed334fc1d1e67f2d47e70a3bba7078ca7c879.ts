// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/process_queue.ts


import { eventHandlers } from "../bot.ts";
import { DiscordHTTPResponseCodes } from "../types/codes/http_response_codes.ts";
import { delay } from "../util/utils.ts";
import { rest } from "./rest.ts";

/** Processes the queue by looping over each path separately until the queues are empty. */
export async function processQueue(id: string) {
  const queue = rest.pathQueues.get(id);
  if (!queue) return;

  while (queue.length) {
    rest.eventHandlers.debug?.("loop", "Running while loop in processQueue function.");
    // IF THE BOT IS GLOBALLY RATELIMITED TRY AGAIN
    if (rest.globallyRateLimited) {
      setTimeout(async () => {
        eventHandlers.debug?.("loop", `Running setTimeout in processQueue function.`);
        await processQueue(id);
      }, 1000);

      break;
    }
    // SELECT THE FIRST ITEM FROM THIS QUEUE
    const [queuedRequest] = queue;
    // IF THIS DOESNT HAVE ANY ITEMS JUST CANCEL, THE CLEANER WILL REMOVE IT.
    if (!queuedRequest) return;

    const basicURL = rest.simplifyUrl(queuedRequest.request.url, queuedRequest.request.method.toUpperCase());

    // IF THIS URL IS STILL RATE LIMITED, TRY AGAIN
    const urlResetIn = rest.checkRateLimits(basicURL);
    if (urlResetIn) {
      // PAUSE FOR THIS SPECIFC REQUEST
      await delay(urlResetIn);
      continue;
    }

    // IF A BUCKET EXISTS, CHECK THE BUCKET'S RATE LIMITS
    const bucketResetIn = queuedRequest.payload.bucketId ? rest.checkRateLimits(queuedRequest.payload.bucketId) : false;
    // THIS BUCKET IS STILL RATELIMITED, RE-ADD TO QUEUE
    if (bucketResetIn) continue;

    // EXECUTE THE REQUEST

    // IF THIS IS A GET REQUEST, CHANGE THE BODY TO QUERY PARAMETERS
    const query =
      queuedRequest.request.method.toUpperCase() === "GET" && queuedRequest.payload.body
        ? Object.entries(queuedRequest.payload.body)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`)
            .join("&")
        : "";
    const urlToUse =
      queuedRequest.request.method.toUpperCase() === "GET" && query
        ? `${queuedRequest.request.url}?${query}`
        : queuedRequest.request.url;

    // CUSTOM HANDLER FOR USER TO LOG OR WHATEVER WHENEVER A FETCH IS MADE
    rest.eventHandlers.fetching(queuedRequest.payload);

    try {
      const response = await fetch(urlToUse, rest.createRequestBody(queuedRequest));

      rest.eventHandlers.fetched(queuedRequest.payload);
      const bucketIdFromHeaders = rest.processRequestHeaders(basicURL, response.headers);
      // SET THE BUCKET Id IF IT WAS PRESENT
      if (bucketIdFromHeaders) {
        queuedRequest.payload.bucketId = bucketIdFromHeaders;
      }

      if (response.status < 200 || response.status >= 400) {
        rest.eventHandlers.error("httpError", queuedRequest.payload, response);

        let error = "REQUEST_UNKNOWN_ERROR";
        switch (response.status) {
          case DiscordHTTPResponseCodes.BadRequest:
            error = "The request was improperly formatted, or the server couldn't understand it.";
            break;
          case DiscordHTTPResponseCodes.Unauthorized:
            error = "The Authorization header was missing or invalid.";
            break;
          case DiscordHTTPResponseCodes.Forbidden:
            error = "The Authorization token you passed did not have permission to the resource.";
            break;
          case DiscordHTTPResponseCodes.NotFound:
            error = "The resource at the location specified doesn't exist.";
            break;
          case DiscordHTTPResponseCodes.MethodNotAllowed:
            error = "The HTTP method used is not valid for the location specified.";
            break;
          case DiscordHTTPResponseCodes.GatewayUnavailable:
            error = "There was not a gateway available to process your request. Wait a bit and retry.";
            break;
        }

        queuedRequest.request.reject?.(new Error(`[${response.status}] ${error}`));

        // If Rate limited should not remove from queue
        if (response.status !== 429) queue.shift();
        continue;
      }

      // SOMETIMES DISCORD RETURNS AN EMPTY 204 RESPONSE THAT CAN'T BE MADE TO JSON
      if (response.status === 204) {
        rest.eventHandlers.fetchSuccess(queuedRequest.payload);
        // REMOVE FROM QUEUE
        queue.shift();
        queuedRequest.request.respond({ status: 204 });
      } else {
        // CONVERT THE RESPONSE TO JSON
        const json = await response.json();
        // IF THE RESPONSE WAS RATE LIMITED, HANDLE ACCORDINGLY
        if (json.retry_after || json.message === "You are being rate limited.") {
          // IF IT HAS MAXED RETRIES SOMETHING SERIOUSLY WRONG. CANCEL OUT.
          if (queuedRequest.payload.retryCount >= rest.maxRetryCount) {
            rest.eventHandlers.retriesMaxed(queuedRequest.payload);
            queuedRequest.request.respond({
              status: 200,
              body: JSON.stringify({
                error: "The request was rate limited and it maxed out the retries limit.",
              }),
            });
            // REMOVE ITEM FROM QUEUE TO PREVENT RETRY
            queue.shift();
            continue;
          }

          // SINCE IT WAS RATELIMITE, RETRY AGAIN
          continue;
        }

        rest.eventHandlers.fetchSuccess(queuedRequest.payload);
        // REMOVE FROM QUEUE
        queue.shift();
        queuedRequest.request.respond({
          status: 200,
          body: JSON.stringify(json),
        });
      }
    } catch (error) {
      // SOMETHING WENT WRONG, LOG AND RESPOND WITH ERROR
      rest.eventHandlers.fetchFailed(queuedRequest.payload, error);
      queuedRequest.request.reject?.(error);
      // REMOVE FROM QUEUE
      queue.shift();
    }
  }

  // ONCE QUEUE IS DONE, WE CAN TRY CLEANING UP
  rest.cleanupQueues();
}
