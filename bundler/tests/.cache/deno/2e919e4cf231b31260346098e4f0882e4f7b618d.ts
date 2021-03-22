// Loaded from https://deno.land/x/cliffy@v0.18.0/command/completions/mod.ts


import { Command } from "../command.ts";
import { dim, italic } from "../deps.ts";
import { BashCompletionsCommand } from "./bash.ts";
import { CompleteCommand } from "./complete.ts";
import { FishCompletionsCommand } from "./fish.ts";
import { ZshCompletionsCommand } from "./zsh.ts";

/** Generates shell completion scripts for various shell's. */
export class CompletionsCommand extends Command<void> {
  #cmd?: Command;

  public constructor(cmd?: Command) {
    super();
    this.#cmd = cmd;
    this.description(() => {
      const baseCmd = this.#cmd || this.getMainCommand();
      return `Generate shell completions.

To enable shell completions for this program add following line to your ${
        dim(italic("~/.bashrc"))
      } or similar:

    ${dim(italic(`source <(${baseCmd.getPath()} completions [shell])`))}

    For mor information run ${
        dim(italic(`${baseCmd.getPath()} completions [shell] --help`))
      }
`;
    })
      .action(() => this.showHelp())
      .command("bash", new BashCompletionsCommand(this.#cmd))
      .command("fish", new FishCompletionsCommand(this.#cmd))
      .command("zsh", new ZshCompletionsCommand(this.#cmd))
      .command("complete", new CompleteCommand(this.#cmd).hidden())
      .reset();
  }
}
