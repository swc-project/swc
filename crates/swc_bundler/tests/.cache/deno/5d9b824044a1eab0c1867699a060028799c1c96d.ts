// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/complete.ts


import { Command } from "../command.ts";
import { UnknownCompletionCommand } from "../_errors.ts";
import type { ICompletion } from "../types.ts";

/** Execute auto completion method of command and action. */
export class CompleteCommand
  extends Command<void, [action: string, commandNames?: Array<string>]> {
  public constructor(cmd?: Command) {
    super();
    this.description("Get completions for given action from given command.")
      .arguments("<action:string> [command...:string]")
      .action(async (_, action: string, commandNames?: Array<string>) => {
        let parent: Command | undefined;
        const completeCommand: Command = commandNames
          ?.reduce((cmd: Command, name: string): Command => {
            parent = cmd;
            const childCmd: Command | undefined = cmd.getCommand(name, false);
            if (!childCmd) {
              throw new UnknownCompletionCommand(name, cmd.getCommands());
            }
            return childCmd;
          }, cmd || this.getMainCommand()) ?? (cmd || this.getMainCommand());

        const completion: ICompletion | undefined = completeCommand
          .getCompletion(action);
        const result: Array<string> =
          await completion?.complete(completeCommand, parent) ?? [];

        if (result?.length) {
          Deno.stdout.writeSync(new TextEncoder().encode(result.join("\n")));
        }
      })
      .reset();
  }
}
