import { R } from "../../deps.ts";

/**
 * Converts OpenAPI URL path parameters (e.g. "/{parameter}") to colon parameters (e.g. "/:parameter")
 */
export const oasPathParamsToColonParams: (uri: string) => string =
  // deno-lint-ignore no-explicit-any
  (R as any).replace(/\/\{(\w+)\}(?=\/|$)/g, `/:$1`);
