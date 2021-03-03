// Loaded from https://deno.land/x/args@1.0.7/wrapper.ts


import {
  ParseError,
  FlagType,
} from "./types.ts";

import {
  iterateArguments,
} from "./utils.ts";

import {
  BLANK,
  Command,
  Describe,
  FlaggedCommand,
  SubCommand,
  MergeCommand,
  CommandReturn,
  FlaggedCommandReturn,
  SubCommandReturn,
  ParseFailure,
} from "./command-types.ts";

import help from "./help.ts";

type ParseResult<
  Main extends CommandReturn<any, any, any>,
  ErrList extends readonly ParseError[],
> = Main | ParseFailure<ErrList>;

/**
 * @template MainVal Type of value of current pipeline
 * @template Main Type of command parser of current pipeline
 * @template ErrList Possible type of list of errors of current pipeline
 */
class Wrapper<
  MainVal,
  Main extends CommandReturn<any, any, any>,
  ErrList extends readonly ParseError[],
> {
  constructor(
    private readonly _command: Command<Main, ErrList>,
  ) {}

  /**
   * Parse a list of raw arguments
   * @param args List of raw arguments
   * @returns Parsing result
   */
  public parse(args: readonly string[]): ParseResult<Main, ErrList> {
    return this._command.extract([...iterateArguments(args)]);
  }

  /**
   * Set description to command parser of current pipeline
   * @param description Command's description
   * @returns A wrapper with a new description
   */
  public describe(description: string): Wrapper<MainVal, Main, ErrList> {
    return new Wrapper(Describe(this._command, description));
  }

  /**
   * Add a flag/option parser to command of current pipeline
   * @template NextKey Type of flag name
   * @template NextVal Type of flag value
   * @param flag Parser and type of flag to be added
   * @returns A wrapper with added flag
   */
  public with<
    NextKey extends string,
    NextVal,
  >(
    flag: FlagType<NextKey, NextVal>,
  ): Wrapper<
    MainVal & Record<NextKey, NextVal>,
    FlaggedCommandReturn<MainVal, NextKey, NextVal>,
    readonly ParseError[]
  > {
    return new Wrapper(FlaggedCommand(this._command, flag));
  }

  /**
   * Add a subcommand parser alternate to (main) command of current pipeline
   * @template Name Type of subcommand name
   * @template SubVal Value of subcommand parser
   * @template NextErrList Possible type of list of errors of subcommand parser
   * @param name Subcommand name
   * @param sub Subcommand wrapper
   * @returns A wrapper with added subcommand
   */
  public sub<
    Name extends string,
    SubVal extends CommandReturn<any, any, any>,
    NextErrList extends readonly ParseError[],
  >(
    name: Name,
    sub: Wrapper<MainVal, SubVal, ErrList>,
  ): Wrapper<
    SubVal,
    SubCommandReturn<Main, Name, SubVal>,
    ErrList | NextErrList
  > {
    return new Wrapper(SubCommand(this._command, name, sub._command));
  }

  /**
   * Merge with another wrapper
   * @param next Wrapper to merge with
   * @returns A merged wrapper
   */
  public merge<NextVal>(
    next: Wrapper<NextVal, CommandReturn.Main<NextVal>, readonly ParseError[]>,
  ): Wrapper<
    MainVal & NextVal,
    CommandReturn.Main<MainVal & NextVal>,
    readonly ParseError[]
  > {
    return new Wrapper(
      MergeCommand<MainVal, NextVal, ParseError>(this._command, next._command),
    );
  }

  /**
   * Get help message
   * @param cmdPath Path to target subcommand
   * @returns Help message
   */
  public help(...cmdPath: readonly string[]): string {
    return help(this._command, cmdPath);
  }
}

/** Starting point of parser construction pipeline */
export const args = new Wrapper(BLANK);
export default args;
