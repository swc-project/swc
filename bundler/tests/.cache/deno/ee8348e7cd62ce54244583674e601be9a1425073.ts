// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command_interaction_data_option.ts


import { DiscordApplicationCommandOptionTypes } from "./application_command_option_types.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#interaction-applicationcommandinteractiondataoption */
export type ApplicationCommandInteractionDataOption =
  | ApplicationCommandInteractionDataOptionSubCommand
  | ApplicationCommandInteractionDataOptionSubCommandGroup
  | ApplicationCommandInteractionDataOptionWithValue;

export type ApplicationCommandInteractionDataOptionWithValue =
  | ApplicationCommandInteractionDataOptionString
  | ApplicationCommandInteractionDataOptionInteger
  | ApplicationCommandInteractionDataOptionBoolean
  | ApplicationCommandInteractionDataOptionUser
  | ApplicationCommandInteractionDataOptionChannel
  | ApplicationCommandInteractionDataOptionRole
  | ApplicationCommandInteractionDataOptionMentionable;

interface ApplicationCommandInteractionDataOptionBase<T extends DiscordApplicationCommandOptionTypes, V = unknown> {
  /** The name of the parameter */
  name: string;
  /** Type of the option */
  type: T;
  /** The value of the pair */
  value: V;
}

export interface ApplicationCommandInteractionDataOptionSubCommand
  extends Omit<ApplicationCommandInteractionDataOptionBase<DiscordApplicationCommandOptionTypes.SubCommand>, "value"> {
  /** Present if this option is a group or subcommand */
  options?: ApplicationCommandInteractionDataOptionWithValue[];
}

export interface ApplicationCommandInteractionDataOptionSubCommandGroup
  extends Omit<
    ApplicationCommandInteractionDataOptionBase<DiscordApplicationCommandOptionTypes.SubCommandGroup>,
    "value"
  > {
  /** Present if this option is a group or subcommand */
  options?: ApplicationCommandInteractionDataOptionSubCommand[];
}

export type ApplicationCommandInteractionDataOptionString = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.String,
  string
>;

export type ApplicationCommandInteractionDataOptionInteger = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.Integer,
  number
>;

export type ApplicationCommandInteractionDataOptionBoolean = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.Boolean,
  boolean
>;

export type ApplicationCommandInteractionDataOptionUser = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.User,
  string
>;

export type ApplicationCommandInteractionDataOptionChannel = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.Channel,
  string
>;

export type ApplicationCommandInteractionDataOptionRole = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.Role,
  string
>;

export type ApplicationCommandInteractionDataOptionMentionable = ApplicationCommandInteractionDataOptionBase<
  DiscordApplicationCommandOptionTypes.Mentionable,
  string
>;
