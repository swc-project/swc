// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/literal.ts


// import { ZodUndefined } from './undefined';
// import { ZodNull } from './null';
// import { ZodUnion } from './union';
import { Primitive } from "../helpers/primitive.ts";
import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef } from "./base.ts";

type LiteralValue = Primitive;

export interface ZodLiteralDef<T extends any = any> extends ZodTypeDef {
  t: ZodTypes.literal;
  value: T;
}

export class ZodLiteral<T extends any> extends ZodType<T, ZodLiteralDef<T>> {
  // opt optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  // null nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  toJSON = () => this._def;

  static create = <T extends LiteralValue>(value: T): ZodLiteral<T> => {
    return new ZodLiteral({
      t: ZodTypes.literal,
      value: value,
    });
  };
}
