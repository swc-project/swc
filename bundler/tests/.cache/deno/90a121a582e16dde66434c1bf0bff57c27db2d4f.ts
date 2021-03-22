// Loaded from https://deno.land/x/cliffy@v0.18.0/ansi/ansi.ts


import * as ansiEscapes from "./ansi_escapes.ts";
import type { Chain } from "./chain.ts";

type Args = Array<unknown>;
type Executor = (this: AnsiChain, ...args: Args) => string;
type Property = string | Executor;
type PropertyNames = keyof Chain<AnsiChain>;

/** Ansi instance returned by all ansi escape properties. */
export interface AnsiChain extends Chain<AnsiChain> {
  /** Get ansi escape sequence. */
  (): string;
  /** Get ansi escape sequence. */
  toString(): string;
  /** Get ansi escape sequence as Uint8Array. */
  toBuffer(): Uint8Array;
}

/** Create new `Ansi` instance. */
export type AnsiFactory = () => Ansi;

/**
 * Chainable ansi escape sequence's.
 * If invoked as method, a new Ansi instance will be returned.
 */
export type Ansi = AnsiFactory & AnsiChain;

/**
 * Chainable ansi escape sequence's.
 * If invoked as method, a new Ansi instance will be returned.
 * ```
 * await Deno.stdout.write(
 *   new TextEncoder().encode(
 *     ansi.cursorTo(0, 0).eraseScreen(),
 *   ),
 * );
 * ```
 * Or shorter:
 * ```
 * await Deno.stdout.write(
 *   ansi.cursorTo(0, 0).eraseScreen.toBuffer(),
 * );
 * ```
 */
export const ansi: Ansi = factory();

function factory(): Ansi {
  let result: Array<string> = [];
  let stack: Array<[Property, Args]> = [];

  const ansi: Ansi = function (
    this: AnsiChain | undefined,
    ...args: Args
  ): string | AnsiChain {
    if (this) {
      if (args.length) {
        update(args);
        return this;
      }
      return this.toString();
    }
    return factory();
  } as Ansi;

  ansi.text = function (text: string): AnsiChain {
    stack.push([text, []]);
    return this;
  };

  ansi.toString = function (): string {
    update();
    const str: string = result.join("");
    result = [];
    return str;
  };

  ansi.toBuffer = function (): Uint8Array {
    return new TextEncoder().encode(this.toString());
  };

  const methodList: Array<[PropertyNames, Property]> = Object.entries(
    ansiEscapes,
  ) as Array<[PropertyNames, Property]>;

  for (const [name, method] of methodList) {
    Object.defineProperty(ansi, name, {
      get(this: AnsiChain) {
        stack.push([method, []]);
        return this;
      },
    });
  }

  return ansi;

  function update(args?: Args) {
    if (!stack.length) {
      return;
    }
    if (args) {
      stack[stack.length - 1][1] = args;
    }
    result.push(
      ...stack.map(([prop, args]: [Property, Args]) =>
        typeof prop === "string" ? prop : prop.call(ansi, ...args)
      ),
    );
    stack = [];
  }
}
