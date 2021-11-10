// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command_option_types.ts


/** https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoptiontype */
export enum DiscordApplicationCommandOptionTypes {
  SubCommand = 1,
  SubCommandGroup,
  String,
  Integer,
  Boolean,
  User,
  Channel,
  Role,
  Mentionable,
}

export type ApplicationCommandOptionTypes = DiscordApplicationCommandOptionTypes;
export const ApplicationCommandOptionTypes = DiscordApplicationCommandOptionTypes;
