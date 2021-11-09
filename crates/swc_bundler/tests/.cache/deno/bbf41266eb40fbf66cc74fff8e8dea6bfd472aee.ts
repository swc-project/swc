// Loaded from https://deno.land/x/validasaur/src/rules/is_ipv4.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isIPv4(value: any): Validity {
  if (typeof value !== "string") {
    return invalid("isIPv4", { value });
  }

  if (!value.match(/^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/)) {
    return invalid("isIPv4", { value });
  }
}
