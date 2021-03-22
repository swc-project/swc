// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/types/number.ts


import type { ITypeHandler, ITypeInfo } from "../types.ts";

/** Number type handler. Excepts any numeric value. */
export const number: ITypeHandler<number> = (
  { label, name, value, type }: ITypeInfo,
): number => {
  if (isNaN(Number(value))) {
    throw new Error(
      `${label} "${name}" must be of type "${type}", but got "${value}".`,
    );
  }

  return parseFloat(value);
};
