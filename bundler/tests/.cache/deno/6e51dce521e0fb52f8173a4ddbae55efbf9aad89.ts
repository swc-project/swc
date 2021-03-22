// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/_errors.ts


import { didYouMeanOption, didYouMeanType, getFlag } from "./_utils.ts";
import type { IFlagOptions } from "./types.ts";

export class FlagsError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, FlagsError.prototype);
  }
}

export class UnknownRequiredOption extends FlagsError {
  constructor(option: string, options: Array<IFlagOptions>) {
    super(
      `Unknown required option "${getFlag(option)}".${
        didYouMeanOption(option, options)
      }`,
    );
    Object.setPrototypeOf(this, UnknownRequiredOption.prototype);
  }
}

export class UnknownConflictingOption extends FlagsError {
  constructor(option: string, options: Array<IFlagOptions>) {
    super(
      `Unknown conflicting option "${getFlag(option)}".${
        didYouMeanOption(option, options)
      }`,
    );
    Object.setPrototypeOf(this, UnknownConflictingOption.prototype);
  }
}

export class DuplicateOptionName extends FlagsError {
  constructor(name: string) {
    super(`Option with name "${getFlag(name)}" already exists.`);
    Object.setPrototypeOf(this, DuplicateOptionName.prototype);
  }
}

export class UnknownType extends FlagsError {
  constructor(type: string, types: Array<string>) {
    super(`Unknown type "${type}".${didYouMeanType(type, types)}`);
    Object.setPrototypeOf(this, UnknownType.prototype);
  }
}

/* Validation errors. */

/**
 * A validation error is thrown when the command is wrongly used by the user.
 * For example: If the user passes some invalid options or arguments to the
 * command.
 */
export class ValidationError extends FlagsError {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class UnknownOption extends ValidationError {
  constructor(option: string, options: Array<IFlagOptions>) {
    super(
      `Unknown option "${getFlag(option)}".${
        didYouMeanOption(option, options)
      }`,
    );
    Object.setPrototypeOf(this, UnknownOption.prototype);
  }
}

export class MissingOptionValue extends ValidationError {
  constructor(option: string) {
    super(`Missing value for option "${getFlag(option)}".`);
    Object.setPrototypeOf(this, MissingOptionValue.prototype);
  }
}

export class InvalidOptionValue extends ValidationError {
  constructor(option: string, expected: string, value: string) {
    super(
      `Option "${
        getFlag(option)
      }" must be of type "${expected}", but got "${value}".`,
    );
    Object.setPrototypeOf(this, InvalidOptionValue.prototype);
  }
}

export class OptionNotCombinable extends ValidationError {
  constructor(option: string) {
    super(`Option "${getFlag(option)}" cannot be combined with other options.`);
    Object.setPrototypeOf(this, OptionNotCombinable.prototype);
  }
}

export class ConflictingOption extends ValidationError {
  constructor(option: string, conflictingOption: string) {
    super(
      `Option "${getFlag(option)}" conflicts with option "${
        getFlag(conflictingOption)
      }".`,
    );
    Object.setPrototypeOf(this, ConflictingOption.prototype);
  }
}

export class DependingOption extends ValidationError {
  constructor(option: string, dependingOption: string) {
    super(
      `Option "${getFlag(option)}" depends on option "${
        getFlag(dependingOption)
      }".`,
    );
    Object.setPrototypeOf(this, DependingOption.prototype);
  }
}

export class MissingRequiredOption extends ValidationError {
  constructor(option: string) {
    super(`Missing required option "${getFlag(option)}".`);
    Object.setPrototypeOf(this, MissingRequiredOption.prototype);
  }
}

export class RequiredArgumentFollowsOptionalArgument extends ValidationError {
  constructor(arg: string) {
    super(
      `An required argument cannot follow an optional argument, but "${arg}"  is defined as required.`,
    );
    Object.setPrototypeOf(
      this,
      RequiredArgumentFollowsOptionalArgument.prototype,
    );
  }
}

export class ArgumentFollowsVariadicArgument extends ValidationError {
  constructor(arg: string) {
    super(`An argument cannot follow an variadic argument, but got "${arg}".`);
    Object.setPrototypeOf(this, ArgumentFollowsVariadicArgument.prototype);
  }
}

export class NoArguments extends ValidationError {
  constructor() {
    super(`No arguments.`);
    Object.setPrototypeOf(this, NoArguments.prototype);
  }
}
