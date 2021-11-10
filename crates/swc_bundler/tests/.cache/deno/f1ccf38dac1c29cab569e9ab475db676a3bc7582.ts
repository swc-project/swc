// Loaded from https://deno.land/x/discordeno@11.0.0-rc.2/src/types/interactions/commands/application_command.ts


import { ApplicationCommandOption } from "./application_command_option.ts";

/** https://discord.com/developers/docs/interactions/slash-commands#applicationcommand */
export interface ApplicationCommand {
  /** Unique id of the command */
  id: string;
  /** Unique id of the parent application */
  applicationId: string;
  /** 1-32 character name matching lowercase `^[\w-]{1,32}$` */
  name: string;
  /** 1-100 character description */
  description: string;
  /** The parameters for the command */
  options?: ApplicationCommandOption[];
  /** Whether the command is enbaled by default when the app is added to a guild */
  defaultPermission?: boolean;
}
