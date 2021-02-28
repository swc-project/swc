// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/optional.ts


import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef, ZodTypeAny } from "./base.ts";

export interface ZodOptionalDef<T extends ZodTypeAny = ZodTypeAny>
  extends ZodTypeDef {
  t: ZodTypes.optional;
  innerType: T;
}

// This type allows for optional flattening
export type ZodOptionalType<
  T extends ZodTypeAny
> = T extends ZodOptional<ZodTypeAny> ? T : ZodOptional<T>;

export class ZodOptional<T extends ZodTypeAny> extends ZodType<
  T["_output"] | undefined,
  ZodOptionalDef<T>,
  T["_input"] | undefined
> {
  // An optional optional is the original optional
  // optional: () => ZodOptionalType<this> = () => this as ZodOptionalType<this>;
  toJSON = () => ({
    t: this._def.t,
    innerType: this._def.innerType.toJSON(),
  });

  static create = <T extends ZodTypeAny>(type: T): ZodOptionalType<T> => {
    if (type instanceof ZodOptional) return type as ZodOptionalType<T>;

    return new ZodOptional({
      t: ZodTypes.optional,
      innerType: type,
    }) as ZodOptionalType<T>;
  };
}
