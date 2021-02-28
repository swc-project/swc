// Loaded from https://deno.land/x/args@1.0.7/help.ts


import {
  makeIndentN,
  InitMap,
} from "./utils.ts";

import {
  Command,
  CommandHelp,
} from "./command-types.ts";

class HelpCategories extends InitMap<string, CommandHelp[]> {
  protected init(): CommandHelp[] {
    return [];
  }
}

export function* helpLines(
  command: Command<any, any>,
  cmdPath: readonly string[],
): Generator<string, void, unknown> {
  const catMap = new HelpCategories();
  for (const item of command.help(cmdPath)) {
    catMap.get(item.category).push(item);
  }

  for (const [category, items] of catMap) {
    yield category + ":";

    for (const { title, description } of items) {
      yield* makeIndentN(title, 2);
      if (description) yield* makeIndentN(description, 4);
    }
  }
}

export const help = (
  command: Command<any, any>,
  cmdPath: readonly string[],
): string => [...helpLines(command, cmdPath)].join("\n");

export default help;
