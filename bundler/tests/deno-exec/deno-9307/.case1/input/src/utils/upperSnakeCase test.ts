import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

import { upperSnakeCase } from "./upperSnakeCase.ts";

Deno.test({
  name: `"toUpperSnakeCase" should convert to snake case`,
  fn() {
    [
      [`foo`, `FOO`],
      [`foo1`, `FOO_1`],
      [`fooBar`, `FOO_BAR`],
      [`_f`, `F`],
      [`foo-bar`, `FOO_BAR`],
    ].forEach(([input, expected]) => {
      assertEquals(upperSnakeCase(input), expected);
    });
  },
});
