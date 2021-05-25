// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/helpers/misc/get_user.ts


import { rest } from "../../rest/rest.ts";
import type { User } from "../../types/users/user.ts";
import { endpoints } from "../../util/constants.ts";

/** This function will return the raw user payload in the rare cases you need to fetch a user directly from the API. */
export async function getUser(userId: bigint) {
  return await rest.runMethod<User>("get", endpoints.USER(userId));
}
