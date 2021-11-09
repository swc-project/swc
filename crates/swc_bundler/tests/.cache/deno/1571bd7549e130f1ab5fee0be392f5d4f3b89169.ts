// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/integrations/integration_application.ts


import { User } from "../users/user.ts";

/** https://discord.com/developers/docs/resources/guild#integration-application-object-integration-application-structure */
export interface IntegrationApplication {
  /** The id of the app */
  id: string;
  /** The name of the app */
  name: string;
  /** the icon hash of the app */
  icon: string | null;
  /** The description of the app */
  description: string;
  /** The summary of the app */
  summary: string;
  /** The bot associated with this application */
  bot?: User;
}
