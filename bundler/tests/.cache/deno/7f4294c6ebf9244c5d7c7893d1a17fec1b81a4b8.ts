// Loaded from https://deno.land/x/cliffy@v0.18.0/command/types/string.ts


import { string } from "../../flags/types/string.ts";
import { Type } from "../type.ts";
import type { ITypeInfo } from "../types.ts";

/** String type. Allows any value. */
export class StringType extends Type<string> {
  /** Complete string type. */
  public parse(type: ITypeInfo): string {
    return string(type);
  }
}
