import { R } from "../../deps.ts";
import snakeCase from "https://raw.githubusercontent.com/lodash/lodash/master/snakeCase.js";

// deno-lint-ignore no-explicit-any
export const upperSnakeCase = (R as any).compose(
  R.toUpper,
  snakeCase,
);