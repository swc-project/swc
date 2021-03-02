// Loaded from https://deno.land/x/args@1.0.7/flag-errors.ts


import {
  ParseError,
} from "./types.ts";

import {
  flag,
} from "./utils.ts";

import {
  ValueError,
} from "./value-errors.ts";

const fmtFlagList = (names: readonly string[]) => names.map(flag).join(" ");

/**
 * Base class of all `FlagError`
 */
export abstract class FlagError implements ParseError {
  public abstract toString(): string;
}

/**
 * `FlagError` class for when unknown flags being detected in argument list
 */
export class UnknownFlags extends FlagError {
  constructor(
    /** Flag names */
    public readonly names: readonly string[],
  ) {
    super();
  }

  public toString() {
    return `Unknown flags: ${fmtFlagList(this.names)}`;
  }
}

/**
 * `FlagError` class for when required flags not being specified
 */
export class MissingFlag extends FlagError {
  constructor(
    /** Flag name */
    public readonly name: string,
  ) {
    super();
  }

  public toString() {
    return `Flag ${flag(this.name)} is required but missing`;
  }
}

/**
 * `FlagError` class for when two or more aliases of the same option being specified
 */
export class ConflictFlags extends FlagError {
  constructor(
    /** Aliases */
    public readonly names: readonly string[],
  ) {
    super();
  }

  public toString() {
    return `Conflicting options: ${fmtFlagList(this.names)}`;
  }
}

/**
 * `FlagError` class for when an option flag being specified without a value
 */
export class MissingValue extends FlagError {
  constructor(
    /** Option name */
    public readonly name: string | readonly string[],
  ) {
    super();
  }

  public toString() {
    return `Option ${flag(this.name)} requires a value but none was found`;
  }
}

/**
 * `FlagError` class for when a flag being place where a value is expected
 */
export class UnexpectedFlag extends FlagError {
  constructor(
    /** Option name */
    public readonly name: string | readonly string[],
    /** Offender flag (raw form) */
    public readonly unexpectedFlag: string,
  ) {
    super();
  }

  public toString() {
    return `Option ${flag(
      this.name,
    )} requires a value but received flag ${this.unexpectedFlag} instead`;
  }
}

/**
 * `FlagError` class for when an argument fails to convert to a value
 */
export class ValueParsingFailure extends FlagError {
  constructor(
    /** Option name */
    public readonly name: string | readonly string[],
    /** Value parsing error */
    public readonly error: ValueError,
  ) {
    super();
  }

  public toString() {
    return `Failed to parse ${flag(this.name)}: ${this.error.toString()}`;
  }
}
