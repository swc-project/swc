// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/run_method.ts


import { API_VERSION, BASE_URL, IMAGE_BASE_URL } from "../util/constants.ts";
import { loopObject } from "../util/loop_object.ts";
import { camelize } from "../util/utils.ts";
import { rest } from "./rest.ts";

// deno-lint-ignore no-explicit-any
export async function runMethod<T = any>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  body?: unknown,
  retryCount = 0,
  bucketId?: string
): Promise<T> {
  if (body) {
    body = loopObject(
      body as Record<string, unknown>,
      (value) =>
        typeof value === "bigint"
          ? value.toString()
          : Array.isArray(value)
          ? value.map((v) => (typeof v === "bigint" ? v.toString() : v))
          : value,
      `Running forEach loop in runMethod function for changing bigints to strings.`
    );
  }

  rest.eventHandlers.debug?.("requestCreate", {
    method,
    url,
    body,
    retryCount,
    bucketId,
  });

  const errorStack = new Error("Location:");
  Error.captureStackTrace(errorStack);

  // For proxies we don't need to do any of the legwork so we just forward the request
  if (!url.startsWith(`${BASE_URL}/v${API_VERSION}`) && !url.startsWith(IMAGE_BASE_URL)) {
    const result = await fetch(url, {
      body: JSON.stringify(body || {}),
      headers: {
        authorization: rest.authorization,
      },
      method: method.toUpperCase(),
    }).catch((error) => {
      console.error(error);
      throw errorStack;
    });

    return result.status !== 204 ? await result.json() : undefined;
  }

  // No proxy so we need to handle all rate limiting and such
  return new Promise((resolve, reject) => {
    rest.processRequest(
      {
        url,
        method,
        reject: (error) => {
          console.error(error);
          reject(errorStack);
        },
        respond: (data: { status: number; body?: string }) =>
          resolve(data.status !== 204 ? camelize<T>(JSON.parse(data.body ?? "{}")) : (undefined as unknown as T)),
      },
      {
        bucketId,
        body: body as Record<string, unknown> | undefined,
        retryCount,
      }
    );
  });
}
