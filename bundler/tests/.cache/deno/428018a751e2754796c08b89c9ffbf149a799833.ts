// Loaded from https://deno.land/x/args@1.0.7/value-types.ts


import {
  ValueType,
} from "./types.ts";

import {
  ok,
  err,
} from "./utils.ts";

import {
  NotANumber,
  NotAnInteger,
  InvalidChoice,
} from "./value-errors.ts";

const sharedProps = (typeName: string) => ({
  [Symbol.toStringTag]: typeName,
});

/** Type and parser of text (string) value */
export const Text: ValueType<string, readonly [string]> = {
  extract: ([raw]) => ok(raw),
  getTypeName: () => "text",
  ...sharedProps("Text"),
};

/** Type and parser of all number values except NaN and Infinity */
export const FiniteNumber: ValueType<number, readonly [string]> = {
  extract([raw]) {
    const value = Number(raw);
    return isFinite(value)
      ? ok(value)
      : err(new NotANumber(raw));
  },
  getTypeName: () => "number",
  ...sharedProps("FiniteNumber"),
};

/** Type and parser of all BigInt values */
export const Integer: ValueType<bigint, readonly [string]> = {
  extract([raw]) {
    try {
      return ok(BigInt(raw));
    } catch (error) {
      return err(new NotAnInteger(raw, error));
    }
  },
  getTypeName: () => "integer",
  ...sharedProps("Integer"),
};

/**
 * Create type and parser of choice (union)
 * @template Value Union type of choices to make
 * @param choices Choices to make
 * @returns Type and parser of choices
 */
export function Choice<
  Value extends number | string,
>(...choices: {
  readonly value: Value;
  readonly describe?: string;
}[]): ValueType<Value, readonly [string]> {
  const values = choices.map((x) => x.value);
  const valueStrings = values.map((x) => String(x));

  { // check for duplication
    const duplications = valueStrings.filter((x, i) =>
      valueStrings.indexOf(x) !== i
    );
    if (duplications.length) {
      throw new RangeError(`Duplicated choices: ${duplications.join(" ")}`);
    }
  }

  { // check for invalid numbers
    const invalidNumbers = values.filter((x) =>
      typeof x === "number" && !isFinite(x)
    );
    if (invalidNumbers.length) {
      throw new RangeError(`Invalid numbers: ${invalidNumbers.join(" ")}`);
    }
  }

  return {
    extract([raw]) {
      for (const value of values) {
        if (value === raw || value === Number(raw)) return ok(value);
      }
      return err(new InvalidChoice(raw, values));
    },
    getTypeName: () => "choice",
    help() {
      let text = "";
      for (const { value, describe } of choices) {
        const suffix = describe ? `${value}: ${describe}` : String(value);
        text += "‣ " + suffix + "\n";
      }
      return text.trim();
    },
    ...sharedProps(`Choice(${values.join(",")})`),
  };
}
