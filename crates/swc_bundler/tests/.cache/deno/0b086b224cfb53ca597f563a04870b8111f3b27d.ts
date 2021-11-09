// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/_fish_completions_generator.ts


import type { Command } from "../command.ts";
import type { IOption } from "../types.ts";

/** Generates fish completions script. */
interface CompleteOptions {
  description?: string;
  shortOption?: string;
  longOption?: string;
  required?: boolean;
  standalone?: boolean;
  arguments?: string;
}

/** Fish completions generator. */
export class FishCompletionsGenerator {
  /** Generates fish completions script for given command. */
  public static generate(cmd: Command) {
    return new FishCompletionsGenerator(cmd).generate();
  }

  private constructor(protected cmd: Command) {}

  /** Generates fish completions script. */
  private generate(): string {
    const path = this.cmd.getPath();
    const version: string | undefined = this.cmd.getVersion()
      ? ` v${this.cmd.getVersion()}`
      : "";

    return `#!/usr/bin/env fish
# fish completion support for ${path}${version}

function __fish_${replaceSpecialChars(this.cmd.getName())}_using_command
  set cmds ${getCommandFnNames(this.cmd).join(" ")}
  set words (commandline -opc)
  set cmd "_"
  for word in $words
    switch $word
      case '-*'
        continue
      case '*'
        set word (string replace -r -a '\\W' '_' $word)
        set cmd_tmp $cmd"_$word"
        if contains $cmd_tmp $cmds
          set cmd $cmd_tmp
        end
    end
  end
  if [ "$cmd" = "$argv[1]" ]
    return 0
  end
  return 1
end

${this.generateCompletions(this.cmd).trim()}
`;
  }

  private generateCompletions(command: Command): string {
    const parent: Command | undefined = command.getParent();
    let result = ``;

    if (parent) {
      // command
      result += "\n" + this.complete(parent, {
        description: command.getShortDescription(),
        arguments: command.getName(),
      });
    }

    // arguments
    const commandArgs = command.getArguments();
    if (commandArgs.length) {
      result += "\n" + this.complete(command, {
        arguments: commandArgs.length
          ? this.getCompletionCommand(
            commandArgs[0].action + " " + getCompletionsPath(command),
          )
          : undefined,
      });
    }

    // options
    for (const option of command.getOptions(false)) {
      result += "\n" + this.completeOption(command, option);
    }

    for (const subCommand of command.getCommands(false)) {
      result += this.generateCompletions(subCommand);
    }

    return result;
  }

  private completeOption(command: Command, option: IOption) {
    const shortOption: string | undefined = option.flags
      .find((flag) => flag.length === 2)
      ?.replace(/^(-)+/, "");
    const longOption: string | undefined = option.flags
      .find((flag) => flag.length > 2)
      ?.replace(/^(-)+/, "");

    return this.complete(command, {
      description: option.description,
      shortOption: shortOption,
      longOption: longOption,
      // required: option.requiredValue,
      required: true,
      standalone: option.standalone,
      arguments: option.args.length
        ? this.getCompletionCommand(
          option.args[0].action + " " + getCompletionsPath(command),
        )
        : undefined,
    });
  }

  private complete(command: Command, options: CompleteOptions) {
    const cmd = ["complete"];
    cmd.push("-c", this.cmd.getName());
    cmd.push(
      "-n",
      `'__fish_${replaceSpecialChars(this.cmd.getName())}_using_command __${
        replaceSpecialChars(command.getPath())
      }'`,
    );
    options.shortOption && cmd.push("-s", options.shortOption);
    options.longOption && cmd.push("-l", options.longOption);
    options.standalone && cmd.push("-x");
    cmd.push("-k");
    cmd.push("-f");
    if (options.arguments) {
      options.required && cmd.push("-r");
      cmd.push("-a", options.arguments);
    }
    options.description && cmd.push("-d", `'${options.description}'`);
    return cmd.join(" ");
  }

  private getCompletionCommand(cmd: string): string {
    return `'(${this.cmd.getName()} completions complete ${cmd.trim()})'`;
  }
}

function getCommandFnNames(
  cmd: Command,
  cmds: Array<string> = [],
): Array<string> {
  cmds.push(`__${replaceSpecialChars(cmd.getPath())}`);
  cmd.getCommands(false).forEach((command) => {
    getCommandFnNames(command, cmds);
  });
  return cmds;
}

function getCompletionsPath(command: Command): string {
  return command.getPath()
    .split(" ")
    .slice(1)
    .join(" ");
}

function replaceSpecialChars(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, "_");
}
