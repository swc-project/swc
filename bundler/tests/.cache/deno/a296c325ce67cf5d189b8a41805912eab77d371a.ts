// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/cleanup_queues.ts


import { rest } from "./rest.ts";

/** Cleans up the queues by checking if there is nothing left and removing it. */
export function cleanupQueues() {
  for (const [key, queue] of rest.pathQueues) {
    rest.eventHandlers.debug?.("loop", "Running for of loop in cleanupQueues function.");
    if (queue.length) continue;
    // REMOVE IT FROM CACHE
    rest.pathQueues.delete(key);
  }

  // NO QUEUE LEFT, DISABLE THE QUEUE
  if (!rest.pathQueues.size) rest.processingQueue = false;
}
