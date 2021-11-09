// Loaded from https://deno.land/x/args@1.0.7/command-errors.ts


import {
  ParseError,
} from "./types.ts";

import {
  FlagError,
} from "./flag-errors.ts";

/**
 * Class of error created by `CommandType::extract`
 * @template ErrList Type of array of {@link FlagError}
 */
export class CommandError<
  ErrList extends readonly FlagError[],
> implements ParseError, Iterable<FlagError> {
  constructor(
    /** Array of {@link FlagError} */
    public readonly errors: ErrList,
  ) {}

  public readonly toString = () =>
    this.errors
      .map((error) => error.toString())
      .join("\n");

  public *[Symbol.iterator]() {
    yield* this.errors;
  }
}
