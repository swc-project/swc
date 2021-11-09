// Loaded from https://deno.land/x/args@1.0.7/utils.ts


import {
  Ok,
  Err,
  ParseError,
  ArgvItem,
} from "./types.ts";

/**
 * Create an `Ok`
 * @template Value Type of value to carry
 * @param value Value to carry
 * @returns An `Ok` object that carries `value`
 */
export const ok = <Value>(value: Value): Ok<Value> => ({
  tag: true,
  value,
});

/**
 * Create an `Err`
 * @template Error Type of error to carry
 * @param error Error to carry
 * @returns An `Err` object that carries `error`
 */
export const err = <Error extends ParseError>(error: Error): Err<Error> => ({
  tag: false,
  error,
});

/**
 * Create an object of single property
 * @template Key Type of property key
 * @template Value Type of property value
 * @param key Property key
 * @param value Property value
 * @returns An object of one key-value pair
 */
export const record = <
  Key extends string | number | symbol,
  Value,
>(
  key: Key,
  value: Value,
) => ({ [key]: value }) as Record<Key, Value>;

/**
 * Determine flag prefix
 * @param name Flag name
 * @returns `"-"` for single character name, or `"--"` for otherwise
 */
export const flagPrefix = (name: string): "-" | "--" =>
  name.length === 1 ? "-" : "--";

/**
 * Convert a flag name to a flag argument
 * @param name Flag name
 * @returns Flag argument
 */
export function flag(name: string | readonly string[]) {
  switch (typeof name) {
    case "string":
      return flagPrefix(name) + name;
    case "object":
      return "-" + name.join("");
  }
}

/**
 * Convert a list of raw arguments to an iterator of classified arguments
 * @param args Raw arguments
 * @returns Iterator of classified arguments
 */
export function* iterateArguments(args: readonly string[]) {
  let fn = (raw: string, index: number): ArgvItem[] => {
    if (raw === "--") {
      fn = (raw, index) => ([{ type: "value", index, raw }]);
      return [];
    }

    if (raw.startsWith("--")) {
      return [{
        type: "single-flag",
        name: raw.slice("--".length),
        index,
        raw,
      }];
    }

    if (raw.startsWith("-") && isNaN(raw as any)) {
      return [{
        type: "multi-flag",
        name: [...raw.slice("-".length)],
        index,
        raw,
      }];
    }

    return [{
      type: "value",
      index,
      raw,
    }];
  };

  for (let i = 0; i !== args.length; ++i) {
    yield* fn(args[i], i);
  }
}

/**
 * Divide a list into two, one where `fn` returns `true`, other where `fn` returns `false`
 * @template X0 Type of item
 * @template X1 Type of item where `fn` returns `true`
 * @param xs List
 * @param fn Predicate
 * @returns A tuple of two sub-lists
 */
export function partition<X0, X1 extends X0>(
  xs: Iterable<X0>,
  fn: (x: X0) => x is X1,
): [X1[], X0[]] {
  const left: X1[] = [];
  const right: X0[] = [];
  for (const x of xs) {
    (fn(x) ? left : right).push(x);
  }
  return [left, right];
}

type ArgvFlag = ArgvItem.SingleFlag | ArgvItem.MultiFlag;

/**
 * Create a predicate to filter flags of certain names from a list of classified arguments
 * @param names Chosen flags' names
 * @returns Filter predicate
 */
const flagPredicate = (names: readonly string[]) =>
  (item: ArgvItem): item is ArgvFlag => {
    switch (item.type) {
      case "single-flag":
        return names.includes(item.name);
      case "multi-flag":
        return item.name.some((flag) => names.includes(flag));
      case "value":
        return false;
    }
  };

/**
 * Divide a list of classified arguments into two: one for flags with certain names, other for the rest
 * @param args List of classified arguments
 * @param names Chosen flags' names
 * @returns A tuple of two sub-lists
 */
export const partitionFlags = (
  args: Iterable<ArgvItem>,
  names: readonly string[],
) => partition(args, flagPredicate(names));

/**
 * Filter a list of classified arguments for flags with certain names
 * @param args List of classified arguments
 * @param names Chosen flags' names
 * @returns A list of flags with chosen names
 */
export const findFlags = (
  args: readonly ArgvItem[],
  names: readonly string[],
) => args.filter(flagPredicate(names));

/**
 * Convert a multi-line string into an iterator of lines
 * @param text Multi-line string
 * @returns Lines of `text`
 */
export function* lines(text: string) {
  for (const line of text.split("\n")) {
    yield line;
  }
}

/**
 * Convert a multi-line string into an iterator of lines,
 * with each line being prefixed
 * @param text Multi-line string
 * @param indent Prefix to each line
 * @returns Prefixed lines of `text`
 */
export function* makeIndent(text: string, indent: string) {
  for (const line of lines(text)) {
    yield indent + line;
  }
}

/**
 * Convert a multi-line string into an iterator of lines,
 * with each line being prefixed
 * @param text Multi-line string
 * @param size Size of prefix
 * @returns Prefixed lines of `text`
 */
export const makeIndentN = (text: string, size: number) =>
  makeIndent(text, " ".repeat(size));

/**
 * `Map`-like class where `.get(key)` always result in defined value
 * @template Key Type of key
 * @template Value Type of value
 */
export abstract class InitMap<Key, Value> extends Map<Key, Value> {
  /**
   * This method is called by `this.get` when key of `key` does not exist in `this` yet.
   * Result of this function will then be assigned as value to key of `key`
   * @param key Key that does not exist in `this` yet
   * @returns Intended value to key of `key`
   */
  protected abstract init(key: Key): Value;

  public get(key: Key): Value {
    if (super.has(key)) return super.get(key)!;
    const value = this.init(key);
    super.set(key, value);
    return value;
  }
}
