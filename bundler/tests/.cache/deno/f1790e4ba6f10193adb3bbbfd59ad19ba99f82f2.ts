// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/oauth2/bot_auth_query.ts


import { DiscordOAuth2Scopes } from "./scopes.ts";

/** https://discord.com/developers/docs/topics/oauth2#bot-authorization-flow-bot-auth-parameters */
export interface BotAuthenticationFlowQuery {
  /** App's client id */
  clientId: string;
  /** Needs to include bot for the bot flow */
  scope: DiscordOAuth2Scopes[];
  /** The permissions you're requesting */
  permissions: string;
  /** Pre-fills the dropdown picker with a guild for the user */
  guildId: string;
  /** True or false—disallows the user from changing the guild dropdown */
  disableGuildSelect: boolean;
}
