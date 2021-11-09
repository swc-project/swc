// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/webhooks/get_webhooks.ts


import { rest } from "../../rest/rest.ts";
import type { Webhook } from "../../types/webhooks/webhook.ts";
import { Collection } from "../../util/collection.ts";
import { endpoints } from "../../util/constants.ts";
import { requireBotGuildPermissions } from "../../util/permissions.ts";

/** Returns a list of guild webhooks objects. Requires the MANAGE_WEBHOOKs permission. */
export async function getWebhooks(guildId: bigint) {
  await requireBotGuildPermissions(guildId, ["MANAGE_WEBHOOKS"]);

  const result = await rest.runMethod<Webhook[]>("get", endpoints.GUILD_WEBHOOKS(guildId));

  return new Collection(result.map((webhook) => [webhook.id, webhook]));
}
