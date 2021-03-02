import { assertEquals } from "https://deno.land/std@0.80.0/testing/asserts.ts";

import { toValidGraphQLName } from "./validName.ts";

Deno.test({
  name: `"toValidGraphQLName" should leave valid GraphQL name without change`,
  fn() {
    [`foo`, `_foo`, `FooBar`, `Foo9`, `foo__9__bar`].forEach((validName) =>
      assertEquals(toValidGraphQLName(validName), validName)
    );
  },
});

Deno.test({
  name: `"toValidGraphQLName" shoud convert invalid GraphQL name to valid`,
  fn() {
    Object.entries({
      "9foo": `foo`,
      "foo-bar": `fooBar`,
    }).map(([invalidName, validName]) =>
      assertEquals(toValidGraphQLName(invalidName), validName)
    );
  },
});
