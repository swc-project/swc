// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types/action_list.ts


import type { Command } from "../command.ts";
import { StringType } from "./string.ts";

/** Completion list type. */
export class ActionListType extends StringType {
  constructor(protected cmd: Command) {
    super();
  }

  /** Complete action names. */
  public complete(): string[] {
    return this.cmd.getCompletions()
      .map((type) => type.name)
      // filter unique values
      .filter((value, index, self) => self.indexOf(value) === index);
  }
}
