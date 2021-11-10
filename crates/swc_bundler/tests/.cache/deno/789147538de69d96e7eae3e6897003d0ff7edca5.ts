// Loaded from https://deno.land/std@0.69.0/datetime/formatter.ts


import {
  CallbackResult,
  Rule,
  TestFunction,
  TestResult,
  Tokenizer,
} from "./tokenizer.ts";

function digits(value: string | number, count = 2): string {
  return String(value).padStart(count, "0");
}

// as declared as in namespace Intl
type DateTimeFormatPartTypes =
  | "day"
  | "dayPeriod"
  // | "era"
  | "hour"
  | "literal"
  | "minute"
  | "month"
  | "second"
  | "timeZoneName"
  // | "weekday"
  | "year"
  | "fractionalSecond";

interface DateTimeFormatPart {
  type: DateTimeFormatPartTypes;
  value: string;
}

type TimeZone = "UTC";

interface Options {
  timeZone?: TimeZone;
}

function createLiteralTestFunction(value: string): TestFunction {
  return (string: string): TestResult => {
    return string.startsWith(value)
      ? { value, length: value.length }
      : undefined;
  };
}

function createMatchTestFunction(match: RegExp): TestFunction {
  return (string: string): TestResult => {
    const result = match.exec(string);
    if (result) return { value: result, length: result[0].length };
  };
}

// according to unicode symbols (http://userguide.icu-project.org/formatparse/datetime)
const defaultRules = [
  {
    test: createLiteralTestFunction("yyyy"),
    fn: (): CallbackResult => ({ type: "year", value: "numeric" }),
  },
  {
    test: createLiteralTestFunction("yy"),
    fn: (): CallbackResult => ({ type: "year", value: "2-digit" }),
  },

  {
    test: createLiteralTestFunction("MM"),
    fn: (): CallbackResult => ({ type: "month", value: "2-digit" }),
  },
  {
    test: createLiteralTestFunction("M"),
    fn: (): CallbackResult => ({ type: "month", value: "numeric" }),
  },
  {
    test: createLiteralTestFunction("dd"),
    fn: (): CallbackResult => ({ type: "day", value: "2-digit" }),
  },
  {
    test: createLiteralTestFunction("d"),
    fn: (): CallbackResult => ({ type: "day", value: "numeric" }),
  },

  {
    test: createLiteralTestFunction("hh"),
    fn: (): CallbackResult => ({ type: "hour", value: "2-digit" }),
  },
  {
    test: createLiteralTestFunction("h"),
    fn: (): CallbackResult => ({ type: "hour", value: "numeric" }),
  },
  {
    test: createLiteralTestFunction("mm"),
    fn: (): CallbackResult => ({ type: "minute", value: "2-digit" }),
  },
  {
    test: createLiteralTestFunction("m"),
    fn: (): CallbackResult => ({ type: "minute", value: "numeric" }),
  },
  {
    test: createLiteralTestFunction("ss"),
    fn: (): CallbackResult => ({ type: "second", value: "2-digit" }),
  },
  {
    test: createLiteralTestFunction("s"),
    fn: (): CallbackResult => ({ type: "second", value: "numeric" }),
  },
  {
    test: createLiteralTestFunction("SSS"),
    fn: (): CallbackResult => ({ type: "fractionalSecond", value: 3 }),
  },
  {
    test: createLiteralTestFunction("SS"),
    fn: (): CallbackResult => ({ type: "fractionalSecond", value: 2 }),
  },
  {
    test: createLiteralTestFunction("S"),
    fn: (): CallbackResult => ({ type: "fractionalSecond", value: 1 }),
  },

  {
    test: createLiteralTestFunction("a"),
    fn: (value: unknown): CallbackResult => ({
      type: "dayPeriod",
      value: value as string,
    }),
  },

  // quoted literal
  {
    test: createMatchTestFunction(/^(')(?<value>\\.|[^\']*)\1/),
    fn: (match: unknown): CallbackResult => ({
      type: "literal",
      value: (match as RegExpExecArray).groups!.value as string,
    }),
  },
  // literal
  {
    test: createMatchTestFunction(/^.+?\s*/),
    fn: (match: unknown): CallbackResult => ({
      type: "literal",
      value: (match as RegExpExecArray)[0],
    }),
  },
];

type FormatPart = { type: DateTimeFormatPartTypes; value: string | number };
type Format = FormatPart[];

export class DateTimeFormatter {
  #format: Format;

  constructor(formatString: string, rules: Rule[] = defaultRules) {
    const tokenizer = new Tokenizer(rules);
    this.#format = tokenizer.tokenize(formatString, ({ type, value }) => ({
      type,
      value,
    })) as Format;
  }

  format(date: Date, options: Options = {}): string {
    let string = "";

    const utc = options.timeZone === "UTC";
    const hour12 = this.#format.find(
      (token: FormatPart) => token.type === "dayPeriod",
    );

    for (const token of this.#format) {
      const type = token.type;

      switch (type) {
        case "year": {
          const value = utc ? date.getUTCFullYear() : date.getFullYear();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2).slice(-2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "month": {
          const value = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "day": {
          const value = utc ? date.getUTCDate() : date.getDate();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "hour": {
          let value = utc ? date.getUTCHours() : date.getHours();
          value -= hour12 && date.getHours() > 12 ? 12 : 0;
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "minute": {
          const value = utc ? date.getUTCMinutes() : date.getMinutes();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "second": {
          const value = utc ? date.getUTCSeconds() : date.getSeconds();
          switch (token.value) {
            case "numeric": {
              string += value;
              break;
            }
            case "2-digit": {
              string += digits(value, 2);
              break;
            }
            default:
              throw Error(
                `FormatterError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "fractionalSecond": {
          const value = utc
            ? date.getUTCMilliseconds()
            : date.getMilliseconds();
          string += digits(value, Number(token.value));
          break;
        }
        case "timeZoneName": {
          // string += utc ? "Z" : token.value
          // break
        }
        case "dayPeriod": {
          string += hour12 ? (date.getHours() >= 12 ? "PM" : "AM") : "";
          break;
        }
        case "literal": {
          string += token.value;
          break;
        }

        default:
          throw Error(`FormatterError: { ${token.type} ${token.value} }`);
      }
    }

    return string;
  }

  parseToParts(string: string): DateTimeFormatPart[] {
    const parts: DateTimeFormatPart[] = [];

    for (const token of this.#format) {
      const type = token.type;

      let value = "";
      switch (token.type) {
        case "year": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,4}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
          }
          break;
        }
        case "month": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0] as string;
              break;
            }
            case "narrow": {
              value = /^[a-zA-Z]+/.exec(string)?.[0] as string;
              break;
            }
            case "short": {
              value = /^[a-zA-Z]+/.exec(string)?.[0] as string;
              break;
            }
            case "long": {
              value = /^[a-zA-Z]+/.exec(string)?.[0] as string;
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "day": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0] as string;
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "hour": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0] as string;
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "minute": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0] as string;
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "second": {
          switch (token.value) {
            case "numeric": {
              value = /^\d{1,2}/.exec(string)?.[0] as string;
              break;
            }
            case "2-digit": {
              value = /^\d{2}/.exec(string)?.[0] as string;
              break;
            }
            default:
              throw Error(
                `ParserError: value "${token.value}" is not supported`,
              );
          }
          break;
        }
        case "fractionalSecond": {
          value = new RegExp(`^\\d{${token.value}}`).exec(
            string,
          )?.[0] as string;
          break;
        }
        case "timeZoneName": {
          value = token.value as string;
          break;
        }
        case "dayPeriod": {
          value = /^(A|P)M/.exec(string)?.[0] as string;
          break;
        }
        case "literal": {
          if (!string.startsWith(token.value as string)) {
            throw Error(
              `Literal "${token.value}" not found "${string.slice(0, 25)}"`,
            );
          }
          value = token.value as string;
          break;
        }

        default:
          throw Error(`${token.type} ${token.value}`);
      }

      if (!value) {
        throw Error(
          `value not valid for token { ${type} ${value} } ${
            string.slice(
              0,
              25,
            )
          }`,
        );
      }
      parts.push({ type, value });
      string = string.slice(value.length);
    }

    if (string.length) {
      throw Error(
        `datetime string was not fully parsed! ${string.slice(0, 25)}`,
      );
    }

    return parts;
  }

  partsToDate(parts: DateTimeFormatPart[]): Date {
    const date = new Date();
    const utc = parts.find(
      (part) => part.type === "timeZoneName" && part.value === "UTC",
    );

    utc ? date.setUTCHours(0, 0, 0, 0) : date.setHours(0, 0, 0, 0);
    for (const part of parts) {
      switch (part.type) {
        case "year": {
          const value = Number(part.value.padStart(4, "20"));
          utc ? date.setUTCFullYear(value) : date.setFullYear(value);
          break;
        }
        case "month": {
          const value = Number(part.value) - 1;
          utc ? date.setUTCMonth(value) : date.setMonth(value);
          break;
        }
        case "day": {
          const value = Number(part.value);
          utc ? date.setUTCDate(value) : date.setDate(value);
          break;
        }
        case "hour": {
          let value = Number(part.value);
          const dayPeriod = parts.find(
            (part: DateTimeFormatPart) => part.type === "dayPeriod",
          );
          if (dayPeriod?.value === "PM") value += 12;
          utc ? date.setUTCHours(value) : date.setHours(value);
          break;
        }
        case "minute": {
          const value = Number(part.value);
          utc ? date.setUTCMinutes(value) : date.setMinutes(value);
          break;
        }
        case "second": {
          const value = Number(part.value);
          utc ? date.setUTCSeconds(value) : date.setSeconds(value);
          break;
        }
        case "fractionalSecond": {
          const value = Number(part.value);
          utc ? date.setUTCMilliseconds(value) : date.setMilliseconds(value);
          break;
        }
      }
    }
    return date;
  }

  parse(string: string): Date {
    const parts = this.parseToParts(string);
    return this.partsToDate(parts);
  }
}
