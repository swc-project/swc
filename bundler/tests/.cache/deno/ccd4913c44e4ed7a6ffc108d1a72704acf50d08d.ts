// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/zsh.ts


import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { ZshCompletionsGenerator } from "./_zsh_completions_generator.ts";

/** Generates zsh completions script. */
export class ZshCompletionsCommand extends Command<void> {
  #cmd?: Command;
  public constructor(cmd?: Command) {
    super();
    this.#cmd = cmd;
    this.description(() => {
      const baseCmd = this.#cmd || this.getMainCommand();
      return `Generate shell completions for zsh.

To enable zsh completions for this program add following line to your ${
        dim(italic("~/.zshrc"))
      }:

    ${dim(italic(`source <(${baseCmd.getPath()} completions zsh)`))}`;
    })
      .action(() => {
        const baseCmd = this.#cmd || this.getMainCommand();
        Deno.stdout.writeSync(new TextEncoder().encode(
          ZshCompletionsGenerator.generate(baseCmd),
        ));
      });
  }
}
