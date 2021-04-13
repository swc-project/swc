// Loaded from https://deno.land/x/validasaur/src/rules/is_ipv6.ts


import type { Validity } from "../types.ts";
import { invalid } from "../utils.ts";

export function isIPv6(value: any): Validity {
  const invalidResult = invalid("isIPv6", { value });

  if (typeof value !== "string") {
    return invalidResult;
  }

  const segments = value.split(":");

  const invalidSegments = segments.filter(
    (s) => !s.match(/^(|[0-9a-f]{1,4})$/i),
  );
  if (invalidSegments.length > 0) {
    return invalidResult;
  }

  const emptySegmentsCount = segments.filter((s) => s === "").length;
  const startsWithLeadingZeros = value.match(/^::/) ? true : false;
  const endsWithLeadingZeros = value.match(/::$/) ? true : false;

  const maxSegments = startsWithLeadingZeros || endsWithLeadingZeros ? 9 : 8;

  let maxEmptySegments = 1;
  if (startsWithLeadingZeros) {
    maxEmptySegments += 1;
  }
  if (endsWithLeadingZeros) {
    maxEmptySegments += 1;
  }

  if (segments.length > maxSegments || emptySegmentsCount > maxEmptySegments) {
    return invalidResult;
  }
}
