// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/rest/simplify_url.ts


/**
 * Credits: github.com/abalabahaha/eris lib/rest/RequestHandler.js#L397
 * Modified for our usecase
 */

export function simplifyUrl(url: string, method: string) {
  let route = url
    .replace(/\/([a-z-]+)\/(?:[0-9]{17,19})/g, function (match, p) {
      return ["channels", "guilds", "webhooks"].includes(p) ? match : `/${p}/skillzPrefersID`;
    })
    .replace(/\/reactions\/[^/]+/g, "/reactions/skillzPrefersID")
    .replace(/^\/webhooks\/(\d+)\/[A-Za-z0-9-_]{64,}/, "/webhooks/$1/:itohIsAHoti");

  // GENERAL /reactions and /reactions/emoji/@me share the buckets
  if (route.includes("/reactions")) {
    route = route.substring(0, route.indexOf("/reactions") + "/reactions".length);
  }

  // Delete Messsage endpoint has its own ratelimit
  if (method === "DELETE" && route.endsWith("/messages/skillzPrefersID")) {
    route = method + route;
  }

  return route;
}
