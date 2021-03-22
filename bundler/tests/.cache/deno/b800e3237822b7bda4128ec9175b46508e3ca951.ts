// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types/command.ts


import type { Command } from "../command.ts";
import { StringType } from "./string.ts";

/** String type with auto completion of sibling command names. */
export class CommandType extends StringType {
  /** Complete sub-command names of global parent command. */
  public complete(cmd: Command, parent?: Command): string[] {
    return parent?.getCommands(false)
      .map((cmd: Command) => cmd.getName()) || [];
  }
}
