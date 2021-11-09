// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/flags.ts


import { getOption, paramCaseToCamelCase } from "./_utils.ts";
import {
  ArgumentFollowsVariadicArgument,
  DuplicateOptionName,
  InvalidOptionValue,
  MissingOptionValue,
  RequiredArgumentFollowsOptionalArgument,
  UnknownConflictingOption,
  UnknownOption,
  UnknownRequiredOption,
  UnknownType,
} from "./_errors.ts";
import { normalize } from "./normalize.ts";
import type {
  IFlagArgument,
  IFlagOptions,
  IFlagsResult,
  IParseOptions,
  ITypeHandler,
} from "./types.ts";
import { OptionType } from "./types.ts";
import { boolean } from "./types/boolean.ts";
import { number } from "./types/number.ts";
import { string } from "./types/string.ts";
import { validateFlags } from "./validate_flags.ts";

const Types: Record<string, ITypeHandler<unknown>> = {
  [OptionType.STRING]: string,
  [OptionType.NUMBER]: number,
  [OptionType.BOOLEAN]: boolean,
};

/**
 * Parse command line arguments.
 * @param args  Command line arguments e.g: `Deno.args`
 * @param opts  Parse options.
 * ```
 * // example.ts -x 3 -y.z -n5 -abc --beep=boop foo bar baz --deno.land -- --cliffy
 * parseFlags(Deno.args);
 * ```
 * ```
 * {
 *   flags: {
 *     x: "3",
 *     y: { z: true },
 *     n: "5",
 *     a: true,
 *     b: true,
 *     c: true,
 *     beep: "boop",
 *     deno: { land: true }
 *   },
 *   unknown: [ "foo", "bar", "baz" ],
 *   literal: [ "--cliffy" ]
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function parseFlags<O extends Record<string, any> = Record<string, any>>(
  args: string[],
  opts: IParseOptions = {},
): IFlagsResult<O> {
  !opts.flags && (opts.flags = []);

  const normalized = normalize(args);

  let inLiteral = false;
  let negate = false;

  const flags: Record<string, unknown> = {};
  const optionNames: Record<string, string> = {};
  const literal: string[] = [];
  const unknown: string[] = [];
  let stopEarly = false;

  opts.flags.forEach((opt) => {
    opt.depends?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownRequiredOption(flag, opts.flags ?? []);
      }
    });
    opt.conflicts?.forEach((flag) => {
      if (!opts.flags || !getOption(opts.flags, flag)) {
        throw new UnknownConflictingOption(flag, opts.flags ?? []);
      }
    });
  });

  for (let i = 0; i < normalized.length; i++) {
    let option: IFlagOptions | undefined;
    let args: IFlagArgument[] | undefined;
    const current = normalized[i];

    // literal args after --
    if (inLiteral) {
      literal.push(current);
      continue;
    }

    if (current === "--") {
      inLiteral = true;
      continue;
    }

    const isFlag = current.length > 1 && current[0] === "-";
    const next = () => normalized[i + 1];

    if (isFlag && !stopEarly) {
      if (current[2] === "-" || (current[1] === "-" && current.length === 3)) {
        throw new UnknownOption(current, opts.flags);
      }

      negate = current.startsWith("--no-");

      option = getOption(opts.flags, current);
      // if (option && negate) {
      //   const positiveName: string = current.replace(/^-+(no-)?/, "");
      //   option = getOption(opts.flags, positiveName) ?? option;
      // }

      if (!option) {
        if (opts.flags.length) {
          throw new UnknownOption(current, opts.flags);
        }

        option = {
          name: current.replace(/^-+/, ""),
          optionalValue: true,
          type: OptionType.STRING,
        };
      }

      const positiveName: string = option.name.replace(/^no-?/, "");
      const propName: string = paramCaseToCamelCase(positiveName);

      if (typeof flags[propName] !== "undefined" && !option.collect) {
        throw new DuplicateOptionName(current);
      }

      args = option.args?.length ? option.args : [{
        type: option.type,
        requiredValue: option.requiredValue,
        optionalValue: option.optionalValue,
        variadic: option.variadic,
        list: option.list,
        separator: option.separator,
      }];

      let argIndex = 0;
      let inOptionalArg = false;
      const previous = flags[propName];

      parseNext(option, args);

      if (typeof flags[propName] === "undefined") {
        if (typeof option.default !== "undefined") {
          flags[propName] = typeof option.default === "function"
            ? option.default()
            : option.default;
        } else if (args[argIndex].requiredValue) {
          throw new MissingOptionValue(option.name);
        } else {
          flags[propName] = true;
        }
      }

      if (typeof option.value !== "undefined") {
        flags[propName] = option.value(flags[propName], previous);
      } else if (option.collect) {
        const value: unknown[] = Array.isArray(previous) ? previous : [];
        value.push(flags[propName]);
        flags[propName] = value;
      }

      optionNames[propName] = option.name;

      opts.option?.(option, flags[propName]);

      /** Parse next argument for current option. */
      // deno-lint-ignore no-inner-declarations
      function parseNext(option: IFlagOptions, args: IFlagArgument[]): void {
        const arg: IFlagArgument = args[argIndex];

        if (!arg) {
          const flag = next();
          throw new UnknownOption(flag, opts.flags ?? []);
        }

        if (!arg.type) {
          arg.type = OptionType.BOOLEAN;
        }

        if (option.args?.length) {
          // make all value's required per default
          if (
            (typeof arg.optionalValue === "undefined" ||
              arg.optionalValue === false) &&
            typeof arg.requiredValue === "undefined"
          ) {
            arg.requiredValue = true;
          }
        } else {
          // make non boolean value required per default
          if (
            arg.type !== OptionType.BOOLEAN &&
            (typeof arg.optionalValue === "undefined" ||
              arg.optionalValue === false) &&
            typeof arg.requiredValue === "undefined"
          ) {
            arg.requiredValue = true;
          }
        }

        if (arg.requiredValue) {
          if (inOptionalArg) {
            throw new RequiredArgumentFollowsOptionalArgument(option.name);
          }
        } else {
          inOptionalArg = true;
        }

        if (negate) {
          flags[propName] = false;
          return;
        }

        let result: unknown;
        let increase = false;

        if (arg.list && hasNext(arg)) {
          const parsed: unknown[] = next()
            .split(arg.separator || ",")
            .map((nextValue: string) => {
              const value = parseValue(option, arg, nextValue);
              if (typeof value === "undefined") {
                throw new InvalidOptionValue(
                  option.name,
                  arg.type ?? "?",
                  nextValue,
                );
              }
              return value;
            });

          if (parsed?.length) {
            result = parsed;
          }
        } else {
          if (hasNext(arg)) {
            result = parseValue(option, arg, next());
          } else if (arg.optionalValue && arg.type === OptionType.BOOLEAN) {
            result = true;
          }
        }

        if (increase) {
          i++;
          if (!arg.variadic) {
            argIndex++;
          } else if (args[argIndex + 1]) {
            throw new ArgumentFollowsVariadicArgument(next());
          }
        }

        if (
          typeof result !== "undefined" && ((args.length > 1) || arg.variadic)
        ) {
          if (!flags[propName]) {
            flags[propName] = [];
          }

          (flags[propName] as Array<unknown>).push(result);

          if (hasNext(arg)) {
            parseNext(option, args);
          }
        } else {
          flags[propName] = result;
        }

        /** Check if current option should have an argument. */
        function hasNext(arg: IFlagArgument): boolean {
          return !!(
            normalized[i + 1] &&
            (arg.optionalValue || arg.requiredValue || arg.variadic) &&
            (normalized[i + 1][0] !== "-" ||
              (arg.type === OptionType.NUMBER &&
                !isNaN(Number(normalized[i + 1])))) &&
            arg
          );
        }

        /** Parse argument value.  */
        function parseValue(
          option: IFlagOptions,
          arg: IFlagArgument,
          value: string,
        ): unknown {
          const type: string = arg.type || OptionType.STRING;
          const result: unknown = opts.parse
            ? opts.parse({
              label: "Option",
              type,
              name: `--${option.name}`,
              value,
            })
            : parseFlagValue(option, arg, value);

          if (typeof result !== "undefined") {
            increase = true;
          }

          return result;
        }
      }
    } else {
      if (opts.stopEarly) {
        stopEarly = true;
      }
      unknown.push(current);
    }
  }

  if (opts.flags && opts.flags.length) {
    validateFlags(
      opts.flags,
      flags,
      opts.knownFlaks,
      opts.allowEmpty,
      optionNames,
    );
  }

  // convert dotted option keys into nested objects
  const result = Object.keys(flags)
    .reduce((result: Record<string, unknown>, key: string) => {
      if (~key.indexOf(".")) {
        key.split(".").reduce(
          (
            // deno-lint-ignore no-explicit-any
            result: Record<string, any>,
            subKey: string,
            index: number,
            parts: string[],
          ) => {
            if (index === parts.length - 1) {
              result[subKey] = flags[key];
            } else {
              result[subKey] = result[subKey] ?? {};
            }
            return result[subKey];
          },
          result,
        );
      } else {
        result[key] = flags[key];
      }
      return result;
    }, {});

  return { flags: result as O, unknown, literal };
}

function parseFlagValue(
  option: IFlagOptions,
  arg: IFlagArgument,
  value: string,
): unknown {
  const type: string = arg.type || OptionType.STRING;
  const parseType = Types[type];

  if (!parseType) {
    throw new UnknownType(type, Object.keys(Types));
  }

  return parseType({
    label: "Option",
    type,
    name: `--${option.name}`,
    value,
  });
}
