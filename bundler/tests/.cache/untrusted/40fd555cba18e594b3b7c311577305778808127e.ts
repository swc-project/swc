// Loaded from https://raw.githubusercontent.com/colinhacks/zod/654680afc2ede388e71e09104eac5a0088fe3207/deno/lib/types/number.ts


import { errorUtil } from "../helpers/errorUtil.ts";
// import { ZodUndefined } from './undefined';
// import { ZodNull } from './null';
// import { ZodUnion } from './union';
import { ZodIssueCode } from "../ZodError.ts";
import { ZodTypes } from "../ZodTypes.ts";
import { ZodType, ZodTypeDef } from "./base.ts";

export interface ZodNumberDef extends ZodTypeDef {
  t: ZodTypes.number;
}

export class ZodNumber extends ZodType<number, ZodNumberDef> {
  // opt optional: () => ZodUnion<[this, ZodUndefined]> = () => ZodUnion.create([this, ZodUndefined.create()]);

  // null nullable: () => ZodUnion<[this, ZodNull]> = () => ZodUnion.create([this, ZodNull.create()]);

  toJSON = () => this._def;
  static create = (): ZodNumber => {
    return new ZodNumber({
      t: ZodTypes.number,
    });
  };

  min = (minimum: number, message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data >= minimum, {
      code: ZodIssueCode.too_small,
      minimum,
      type: "number",
      inclusive: true,
      ...errorUtil.errToObj(message),
    });

  max = (maximum: number, message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data <= maximum, {
      code: ZodIssueCode.too_big,
      maximum,
      type: "number",
      inclusive: true,
      ...errorUtil.errToObj(message),
    });

  int = (message?: errorUtil.ErrMessage) =>
    this.refinement((data) => Number.isInteger(data), {
      code: ZodIssueCode.invalid_type,
      expected: "integer",
      received: "number",
      ...errorUtil.errToObj(message),
    });

  positive = (message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data > 0, {
      code: ZodIssueCode.too_small,
      minimum: 0,
      type: "number",
      inclusive: false,
      ...errorUtil.errToObj(message),
    });

  negative = (message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data < 0, {
      code: ZodIssueCode.too_big,
      maximum: 0,
      type: "number",
      inclusive: false,
      ...errorUtil.errToObj(message),
    });

  nonpositive = (message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data <= 0, {
      code: ZodIssueCode.too_big,
      maximum: 0,
      type: "number",
      inclusive: true,
      ...errorUtil.errToObj(message),
    });

  nonnegative = (message?: errorUtil.ErrMessage) =>
    this.refinement((data) => data >= 0, {
      code: ZodIssueCode.too_small,
      minimum: 0,
      type: "number",
      inclusive: true,
      ...errorUtil.errToObj(message),
    });
}
