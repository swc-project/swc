// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/types/boolean.ts


import type { ITypeHandler, ITypeInfo } from "../types.ts";

/** Boolean type handler. Excepts `true`, `false`, `1`, `0` */
export const boolean: ITypeHandler<boolean> = (
  { label, name, value, type }: ITypeInfo,
): boolean => {
  if (~["1", "true"].indexOf(value)) {
    return true;
  }

  if (~["0", "false"].indexOf(value)) {
    return false;
  }

  throw new Error(
    `${label} "${name}" must be of type "${type}", but got "${value}".`,
  );
};
