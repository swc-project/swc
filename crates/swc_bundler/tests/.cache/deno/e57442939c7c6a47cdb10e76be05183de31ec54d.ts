// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/bash.ts


import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { BashCompletionsGenerator } from "./_bash_completions_generator.ts";

/** Generates bash completions script. */
export class BashCompletionsCommand extends Command<void> {
  #cmd?: Command;
  public constructor(cmd?: Command) {
    super();
    this.#cmd = cmd;
    this.description(() => {
      const baseCmd = this.#cmd || this.getMainCommand();
      return `Generate shell completions for bash.

To enable bash completions for this program add following line to your ${
        dim(italic("~/.bashrc"))
      }:

    ${dim(italic(`source <(${baseCmd.getPath()} completions bash)`))}`;
    })
      .action(() => {
        const baseCmd = this.#cmd || this.getMainCommand();
        Deno.stdout.writeSync(new TextEncoder().encode(
          BashCompletionsGenerator.generate(baseCmd),
        ));
      });
  }
}
