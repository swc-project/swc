// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types/number.ts


import { number } from "../../flags/types/number.ts";
import { Type } from "../type.ts";
import type { ITypeInfo } from "../types.ts";

/** Number type. */
export class NumberType extends Type<number> {
  /** Parse number type. */
  public parse(type: ITypeInfo): number {
    return number(type);
  }
}
