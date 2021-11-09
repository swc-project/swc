// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/never.ts


import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef } from "./base.ts";

export interface ZodNeverDef extends ZodTypeDef {
  t: ZodTypes.never;
}

export class ZodNever extends ZodType<never, ZodNeverDef> {
  __class = "ZodNever";
  toJSON = () => this._def;

  static create = (): ZodNever => {
    return new ZodNever({
      t: ZodTypes.never,
    });
  };
}
