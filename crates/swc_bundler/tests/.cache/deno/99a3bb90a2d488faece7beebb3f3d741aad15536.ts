// Loaded from https://deno.land/x/args@1.0.7/value-errors.ts


import {
  ParseError,
} from "./types.ts";

/**
 * Base class of all `ValueError`
 */
export abstract class ValueError implements ParseError {
  /** Raw input */
  public abstract readonly raw: string;
  public abstract toString(): string;
}

/**
 * `ValueError` class for when non-number raw input being place in where a number is expected
 */
export class NotANumber extends ValueError {
  constructor(
    /** Raw input */
    public readonly raw: string,
  ) {
    super();
  }

  public toString() {
    return `Not a number: ${this.raw}`;
  }
}

/**
 * `ValueError` class for when non-integer raw input being place in where an integer is expected
 */
export class NotAnInteger extends ValueError {
  constructor(
    /** Raw input */
    public readonly raw: string,
    /** BigInt parsing error */
    public readonly error: SyntaxError,
  ) {
    super();
  }

  public toString() {
    return `Not an integer: ${this.raw} (${this.error})`;
  }
}

/**
 * `ValueError` class for when raw input not matching any expected choice
 * @template ValidChoice Union type of valid choices
 */
export class InvalidChoice<ValidChoice extends string | number>
  extends ValueError {
  constructor(
    /** Raw input */
    public readonly raw: string,
    /** List of valid choices */
    public readonly choices: readonly ValidChoice[],
  ) {
    super();
  }

  public toString() {
    return `Invalid choice: ${this.raw} is not one of ${this.choices.join(
      ", ",
    )}`;
  }
}
