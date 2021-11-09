// Loaded from https://deno.land/x/cliffy@v0.18.0/command/help/mod.ts


import { Command } from "../command.ts";
import { UnknownCommand } from "../_errors.ts";
import { CommandType } from "../types/command.ts";

/** Generates well formatted and colored help output for specified command. */
export class HelpCommand extends Command<void, [command?: string]> {
  public constructor(cmd?: Command) {
    super();
    this.type("command", new CommandType())
      .arguments("[command:command]")
      .description("Show this help or the help of a sub-command.")
      .action((_, name?: string) => {
        if (!cmd) {
          cmd = name
            ? this.getGlobalParent()?.getBaseCommand(name)
            : this.getGlobalParent();
        }
        if (!cmd) {
          const cmds = this.getGlobalParent()?.getCommands();
          throw new UnknownCommand(name ?? "", cmds ?? [], [
            this.getName(),
            ...this.getAliases(),
          ]);
        }
        cmd.showHelp();
        Deno.exit(0);
      });
  }
}
