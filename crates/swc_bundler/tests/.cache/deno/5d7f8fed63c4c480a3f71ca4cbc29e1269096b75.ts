// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/applications/application.ts


import { Team } from "../teams/team.ts";
import { User } from "../users/user.ts";
import { DiscordApplicationFlags } from "./application_flags.ts";

/** https://discord.com/developers/docs/topics/oauth2#application-object */
export interface Application {
  /** The id of the app */
  id: string;
  /** The name of the app */
  name: string;
  /** The icon hash of the app */
  icon: string | null;
  /** The description of the app */
  description: string;
  /** An array of rpc origin urls, if rpc is enabled */
  rpcOrigins?: string[];
  /** When false only app owner can join the app's bot to guilds */
  botPublic: boolean;
  /** When true the app's bot will only join upon completion of the full oauth2 code grant flow */
  botRequireCodeGrant: boolean;
  /** The url of the app's terms of service */
  termsOfServiceUrl?: string;
  /** The url of the app's privacy policy */
  privacyPolicyUrl?: string;
  /** Partial user object containing info on the owner of the application */
  owner: Partial<User>;
  /** If this application is a game sold on Discord, this field will be the summary field for the store page of its primary sku */
  summary: string;
  /** The hex encoded key for verification in interactions and the GameSDK's GetTicket */
  verifyKey: string;
  /** If the application belongs to a team, this will be a list of the members of that team */
  team: Team | null;
  /** If this application is a game sold on Discord, this field will be the guild to which it has been linked */
  guildId?: string;
  /** If this application is a game sold on Discord, this field will be the id of the "Game SKU" that is created, if exists */
  primarySkuId?: string;
  /** If this application is a game sold on Discord, this field will be the URL slug that links to the store page */
  slug?: string;
  /** If this application is a game sold on Discord, this field will be the hash of the image on store embeds */
  coverImage?: string;
  /** The application's public flags */
  flags: DiscordApplicationFlags;
}
