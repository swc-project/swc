// Loaded from https://deno.land/x/cliffy@v0.18.0/flags/types/string.ts


import type { ITypeHandler, ITypeInfo } from "../types.ts";

/** String type handler. Excepts any value. */
export const string: ITypeHandler<string> = ({ value }: ITypeInfo): string => {
  return value;
};
