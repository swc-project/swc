// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/any.ts


import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef } from "./base.ts";
// import { ZodUndefined } from './undefined';
// import { ZodNull } from './null';
// import { ZodUnion } from './union';

export interface ZodAnyDef extends ZodTypeDef {
  t: ZodTypes.any;
}

export class ZodAny extends ZodType<any, ZodAnyDef> {
  // opt optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);
  // null nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);
  toJSON = () => this._def;

  static create = (): ZodAny => {
    return new ZodAny({
      t: ZodTypes.any,
    });
  };
}
