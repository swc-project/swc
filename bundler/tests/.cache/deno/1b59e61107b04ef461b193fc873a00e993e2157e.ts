// Loaded from https://deno.land/x/segno@v1.1.0/lib/validations/isPort.ts


// @ts-ignore allowing typedoc to build
import { isInt } from './isInt.ts';

export const isPort = (str: string) => {
  return isInt(str, { min: 0, max: 65535 });
};
