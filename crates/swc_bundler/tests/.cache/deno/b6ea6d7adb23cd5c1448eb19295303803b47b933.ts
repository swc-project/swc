// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/util/loop_object.ts


import { eventHandlers } from "../bot.ts";

export function loopObject<T = Record<string, unknown>>(
  obj: Record<string, unknown>,
  handler: (value: unknown, key: string) => unknown,
  log: string
) {
  let res: Record<string, unknown> | unknown[] = {};

  if (Array.isArray(obj)) {
    res = [];

    for (const o of obj) {
      if (typeof o === "object" && !Array.isArray(o) && o !== null) {
        // A nested object
        res.push(loopObject(o as Record<string, unknown>, handler, log));
      } else {
        res.push(handler(o, "array"));
      }
    }
  } else {
    for (const [key, value] of Object.entries(obj)) {
      eventHandlers.debug?.("loop", log);

      if (typeof value === "object" && !Array.isArray(value) && value !== null && !(value instanceof Blob)) {
        // A nested object
        res[key] = loopObject(value as Record<string, unknown>, handler, log);
      } else {
        res[key] = handler(value, key);
      }
    }
  }

  return res as T;
}
