// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/undefined.ts


import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef } from "./base.ts";
// import { ZodUnion } from './union';
// import { ZodNull } from './null';

export interface ZodUndefinedDef extends ZodTypeDef {
  t: ZodTypes.undefined;
}

export class ZodUndefined extends ZodType<undefined> {
  toJSON = () => this._def;

  // opt optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  // null nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  static create = (): ZodUndefined => {
    return new ZodUndefined({
      t: ZodTypes.undefined,
    });
  };
}
