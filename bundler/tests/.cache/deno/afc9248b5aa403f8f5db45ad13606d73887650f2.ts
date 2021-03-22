// Loaded from https://deno.land/x/cliffy@v0.18.0/command/type.ts


import type { Command } from "./command.ts";
import type { ITypeInfo } from "./types.ts";

/**
 * Base class for custom types.
 *
 * **Custom type example:**
 * ```
 * export class ColorType extends Type<string> {
 *   public parse({ label, name, value, type }: ITypeInfo): string {
 *     if (["red", "blue"].includes(value)) {
 *       trow new Error(
 *         `${label} "${name}" must be of type "${type}", but got "${value}".` +
 *         "Valid colors are: red, blue"
 *       );
 *     }
 *     return value;
 *   }
 *
 *   public complete(): string[] {
 *     return ["red", "blue"];
 *   }
 * }
 * ```
 */
export abstract class Type<T> {
  public abstract parse(type: ITypeInfo): T;

  public complete?(
    // deno-lint-ignore no-explicit-any
    cmd: Command<any, any, any, any, any>,
    // deno-lint-ignore no-explicit-any
    parent?: Command<any, any, any, any, any>,
  ): string[];
}
