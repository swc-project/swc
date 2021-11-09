// Loaded from https://deno.land/x/args@1.0.7/command-types.ts


import {
  once,
} from "./deps.ts";

import {
  ArgvItem,
  ParseError,
  FlagType,
} from "./types.ts";

import {
  record,
} from "./utils.ts";

import {
  MAIN_COMMAND,
  PARSE_FAILURE,
} from "./symbols.ts";

import {
  CommandError,
} from "./command-errors.ts";

interface ExtraProps {
  remaining(): {
    rawFlags(): readonly string[];
    rawValues(): readonly string[];
    rawArgs(): readonly string[];
  };
  readonly _: readonly string[];
}

function addExtraProps<Main extends {
  readonly consumedArgs: ReadonlySet<ArgvItem>;
}>(main: Main, args: readonly ArgvItem[]): Main & ExtraProps {
  const remaining: ExtraProps["remaining"] = once(() => {
    const { consumedArgs } = object;
    const remainingArgs = args.filter((item) => !consumedArgs.has(item));
    const mapFn = (item: ArgvItem) => item.raw;
    const rawArgs = once(() => remainingArgs.map(mapFn));
    const rawFlags = once(
      () =>
        remainingArgs
          .filter((item) => item.type !== "value")
          .map(mapFn),
    );
    const rawValues = once(
      () =>
        remainingArgs
          .filter((item) => item.type === "value")
          .map(mapFn),
    );
    return {
      rawArgs,
      rawFlags,
      rawValues,
    };
  });
  const object: Main & ExtraProps = {
    get _() {
      return this.remaining().rawArgs();
    },
    remaining,
    ...main,
  };
  return object;
}

/**
 * Success variant of `Command::extract`
 * @template MainVal Type of main dictionary
 * @template Name Command name
 * @template Sub Type of subcommand dictionary
 */
export type CommandReturn<
  MainVal,
  Name extends string,
  Sub extends CommandReturn<any, any, any>,
> = CommandReturn.Main<MainVal> | CommandReturn.Sub<Name, Sub>;

/**
 * Failure variant of `Command::extract`
 * @template ErrList Type of list of errors
 */
export type ParseFailure<
  ErrList extends readonly ParseError[],
> = CommandReturn.Failure<ErrList>;

/**
 * Create a failure for `Command::extract`
 * @template ErrList Type of list of errors
 * @param error List of errors
 * @returns A wrapper of `error`
 */
export const ParseFailure = <
  ErrList extends readonly ParseError[],
>(error: ErrList): ParseFailure<ErrList> => ({
  tag: PARSE_FAILURE,
  error: new CommandError(error),
});

export namespace CommandReturn {
  interface Base {
    /** Discriminant. Determine whether parsing result is from main command, sub command or failure */
    readonly tag: string | MAIN_COMMAND | PARSE_FAILURE;
    /** Parsing result */
    readonly value?: unknown;
    /** Parsing error */
    readonly error?: null | CommandError<any>;
  }

  interface SuccessBase<Value> extends Base, ExtraProps {
    readonly tag: string | MAIN_COMMAND;
    readonly value: Value;
    readonly error?: null;
    readonly consumedArgs: ReadonlySet<ArgvItem>;
  }

  /**
   * Interface of a main command variant
   * @template Value Type of parsing result
   */
  export interface Main<Value> extends SuccessBase<Value> {
    readonly tag: MAIN_COMMAND;
  }

  /**
   * Interface of a sub command variant
   * @template Name Type of subcommand name
   * @template Value Type of wrapped main command
   */
  export interface Sub<
    Name extends string,
    Value extends CommandReturn<any, any, any>,
  > extends SuccessBase<Value> {
    readonly tag: Name;
  }

  interface FailureBase<
    ErrList extends readonly ParseError[],
  > extends Base {
    readonly tag: PARSE_FAILURE;
    readonly error: CommandError<ErrList>;
    readonly value?: null;
  }

  /**
   * Interface of parsing failure
   * @template ErrList Type of list of errors
   */
  export interface Failure<ErrList extends readonly ParseError[]>
    extends FailureBase<ErrList> {}
}

/**
 * Interface of a command parser
 * @template Return Type of parsing result
 * @template ErrList Possible types of list of errors
 */
export interface Command<
  Return extends CommandReturn<any, any, any>,
  ErrList extends readonly ParseError[],
> {
  /**
   * Convert a list of classified arguments to parsing result
   * @param args List of classified arguments
   * @returns Parsing result
   */
  extract(args: readonly ArgvItem[]): Return | ParseFailure<ErrList>;

  /**
   * Describe the command in `--help`
   * @returns An iterable of lines of help messages
   */
  describe(): Iterable<string>;

  /**
   * All components to construct help message so far
   * @param cmdPath Path to target subcommand
   * @returns An iterable of components
   */
  help(cmdPath: readonly string[]): Iterable<CommandHelp>;
}

/**
 * Interface of component of help message of command parser
 */
export interface CommandHelp {
  /** Which section should this component be display under? */
  readonly category: string;
  /** Title of the component */
  readonly title: string;
  /** Content of the component */
  readonly description?: string;
}

/** Type of value of {@link BLANK} */
type BlankReturn = CommandReturn.Main<{}>;
/** Starting point of a command parser construction chain */
export const BLANK: Command<BlankReturn, never> = ({
  extract: (args) =>
    addExtraProps({
      tag: MAIN_COMMAND,
      value: {},
      consumedArgs: new Set<never>(),
    } as const, args),
  describe: () => [],
  *help(): Iterable<CommandHelp> {
    for (const line of this.describe()) {
      yield {
        category: "DESCRIPTION",
        title: line,
      };
    }
  },
});

/**
 * Assign description to a command parser during construction chain
 * @param target Target of description assignment
 * @param description Description to assign
 * @returns A transitive "command parser" that does everything `target` does
 */
export const Describe = <Target extends Command<any, any>>(
  target: Target,
  description: string,
): Target => ({
  ...target,
  describe: () => [description],
});

/**
 * Type of value of {@link FlaggedCommand}
 * @template MainVal Type of main dictionary
 * @template NextKey Type of flag name
 * @template NextVal Type of flag value
 */
export type FlaggedCommandReturn<
  MainVal,
  NextKey extends string,
  NextVal,
> = CommandReturn.Main<MainVal & Record<NextKey, NextVal>>;
/**
 * Return type of `FlaggedCommand::extract`
 * @template MainVal Type of main dictionary
 * @template NextKey Type of flag name
 * @template NextVal Type of flag value
 */
type FlaggedCommandExtract<
  MainVal,
  NextKey extends string,
  NextVal,
  ErrList extends readonly ParseError[],
> = FlaggedCommandReturn<MainVal, NextKey, NextVal> | ParseFailure<
  ErrList | readonly [ParseError]
>;
/**
 * Add a flag parser on top of existing command parser
 * @template MainVal Type of main dictionary
 * @template NextKey Type of flag name
 * @template NextVal Type of flag value
 * @template ErrList Possible type of list of errors
 * @param main Targeted command parser
 * @param flag Flag type to add
 * @returns A command parser that does what `main` and `flag` do
 */
export const FlaggedCommand = <
  MainVal,
  NextKey extends string,
  NextVal,
  ErrList extends readonly ParseError[],
>(
  main: Command<CommandReturn.Main<MainVal>, ErrList>,
  flag: FlagType<NextKey, NextVal>,
): Command<
  FlaggedCommandReturn<MainVal, NextKey, NextVal>,
  ErrList | readonly [ParseError]
> => ({
  extract(args): FlaggedCommandExtract<MainVal, NextKey, NextVal, ErrList> {
    const prevResult = main.extract(args);
    if (prevResult.tag === PARSE_FAILURE) return prevResult;
    const nextResult = flag.extract(args);
    if (!nextResult.tag) return ParseFailure([nextResult.error]);
    const value = {
      ...prevResult.value,
      ...record(flag.name, nextResult.value.value),
    };
    const consumedArgs = new Set([
      ...prevResult.consumedArgs,
      ...nextResult.value.consumedFlags,
    ]);
    return addExtraProps({
      tag: MAIN_COMMAND,
      value,
      consumedArgs,
    } as const, args);
  },
  describe: () => main.describe(),
  *help(cmdPath): Iterable<CommandHelp> {
    if (cmdPath.length) return;
    yield* main.help(cmdPath);
    yield {
      category: "OPTIONS",
      ...flag.help(),
    };
  },
});

/**
 * Type of value of {@link SubCommand}
 * @template Main Type of main wrapper
 * @template Name Type of subcommand name
 * @template Sub Subcommand parser
 */
export type SubCommandReturn<
  Main extends CommandReturn<any, any, any>,
  Name extends string,
  Sub extends CommandReturn<any, any, any>,
> = Main | CommandReturn.Sub<Name, Sub>;
/**
 * Declare add subcommand to existing command parser
 * @template Main Type of main wrapper
 * @template Name Type of subcommand name
 * @template Sub Subcommand parser
 * @template ErrList Possible type of list of errors
 * @param main Main command parser
 * @param name Subcommand name
 * @param sub Subcommand parser
 * @returns A command parser that parses either subcommand or main command
 */
export const SubCommand = <
  Main extends CommandReturn<any, any, any>,
  Name extends string,
  Sub extends CommandReturn<any, any, any>,
  ErrList extends readonly ParseError[],
>(
  main: Command<Main, ErrList>,
  name: Name,
  sub: Command<Sub, ErrList>,
): Command<SubCommandReturn<Main, Name, Sub>, ErrList> => ({
  extract(args): SubCommandReturn<Main, Name, Sub> | ParseFailure<ErrList> {
    if (args.length === 0) return main.extract(args);
    const [first, ...rest] = args;
    if (first.type !== "value" || first.raw !== name) return main.extract(args);
    const result = sub.extract(rest.map((item, index) => ({ ...item, index })));
    if (result.tag === PARSE_FAILURE) return result as ParseFailure<ErrList>;
    const value = result as Sub;
    const consumedArgs = new Set([first, ...value.consumedArgs]);
    return addExtraProps({
      tag: name,
      consumedArgs,
      value,
    } as const, args) as CommandReturn.Sub<Name, Sub>;
  },
  describe: () => main.describe(),
  *help(cmdPath): Iterable<CommandHelp> {
    if (cmdPath.length) {
      const [first, ...rest] = cmdPath;
      yield* first === name
        ? sub.help(rest)
        : main.help(cmdPath);
      return;
    }

    yield* main.help(cmdPath);
    yield {
      category: "SUBCOMMANDS",
      title: name,
      description: [...sub.describe()].join("\n"),
    };
  },
});

/**
 * Type of value of {@link MergeCommand}
 * @template LeftVal Type of left dictionary
 * @template RightVal Type of right dictionary
 */
export type MergeCommandReturn<
  LeftVal,
  RightVal,
> = CommandReturn.Main<LeftVal & RightVal>;
/**
 * Merge two command parsers
 * @template LeftVal Type of left dictionary
 * @template RightVal Type of right dictionary
 * @template Error Type of element of error
 * @param left Left command parser
 * @param right Right command parser
 * @returns A command parser that parses two sets of flags
 */
export const MergeCommand = <
  LeftVal,
  RightVal,
  Error extends ParseError,
>(
  left: Command<CommandReturn.Main<LeftVal>, readonly Error[]>,
  right: Command<CommandReturn.Main<RightVal>, readonly Error[]>,
): Command<MergeCommandReturn<LeftVal, RightVal>, readonly Error[]> => ({
  extract(
    args,
  ): MergeCommandReturn<LeftVal, RightVal> | ParseFailure<readonly Error[]> {
    const leftRes = left.extract(args);
    const rightRes = right.extract(args);
    if (leftRes.tag === MAIN_COMMAND && rightRes.tag === MAIN_COMMAND) {
      const value = { ...leftRes.value, ...rightRes.value };
      const consumedArgs = new Set(
        [...leftRes.consumedArgs, ...rightRes.consumedArgs],
      );
      return addExtraProps({
        tag: MAIN_COMMAND,
        value,
        consumedArgs,
      } as const, args);
    } else {
      const errors = [
        ...leftRes.error?.errors || [],
        ...rightRes.error?.errors || [],
      ];
      return {
        tag: PARSE_FAILURE,
        error: new CommandError(errors),
      };
    }
  },
  *describe(): Iterable<string> {
    yield* left.describe();
    yield* right.describe();
  },
  *help(cmdPath): Iterable<CommandHelp> {
    yield* left.help(cmdPath);
    yield* right.help(cmdPath);
  },
});
