// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types/child_command.ts


import type { Command } from "../command.ts";
import { StringType } from "./string.ts";

/** String type with auto completion of child command names. */
export class ChildCommandType extends StringType {
  #cmd?: Command;

  constructor(cmd?: Command) {
    super();
    this.#cmd = cmd;
  }

  /** Complete child command names. */
  public complete(cmd: Command): string[] {
    return (this.#cmd ?? cmd)?.getCommands(false)
      .map((cmd: Command) => cmd.getName()) || [];
  }
}
