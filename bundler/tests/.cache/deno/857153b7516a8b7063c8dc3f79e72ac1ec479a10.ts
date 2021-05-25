// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/oauth2/get_current_authorization_information.ts


import { User } from "../users/user.ts";
import { Application } from "../applications/application.ts";
import { DiscordOAuth2Scopes } from "./scopes.ts";

/** https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information-response-structure */
export interface GetCurrentAuthorizationInformation {
  /** The current application */
  application: Partial<Application>;
  /** The scopes the user has authorized the application for */
  scopes: DiscordOAuth2Scopes[];
  /** When the access token expires */
  expires: string;
  /** The user who has authorized, if the user has authorized with the `identify` scope */
  user?: User;
}
