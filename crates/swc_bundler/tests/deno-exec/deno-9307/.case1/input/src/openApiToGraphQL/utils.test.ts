import { Spy, spy } from "https://deno.land/x/mock@v0.9.4/mod.ts";
import {
  assertEquals,
  assertNotStrictEquals,
} from "https://deno.land/std@0.80.0/testing/asserts.ts";

import { OpenAPIV3 } from "../../deps.ts";
import { loadFile } from "../utils/deno.loadFile.ts";
import {
  dereference,
  dereferenceAndDistill,
  resolveRef,
} from "./utils.ts";

const petStore = await loadFile<OpenAPIV3.Document>(
  `./__fixtures__/petstore.yaml`,
);

Deno.test({
  name: `"resolveRef" should resolve local references`,
  fn() {
    assertEquals(
      resolveRef(petStore, `#/components/schemas/Error`),
      petStore.components!.schemas!.Error,
    );
  },
});

const boundDereference = dereference(petStore);
Deno.test({
  name: `"dereferenceAndDistill" should pass input to distiller`,
  fn() {
    const distillSpy: Spy<void> = spy();
    const boundDistiller = dereferenceAndDistill(boundDereference, distillSpy);
    const schema = { type: `integer`, format: `int32` };
    const extraArg = `foo`;
    boundDistiller(schema, extraArg);
    assertEquals(distillSpy.calls, [{ args: [schema, extraArg] }]);
  },
});
Deno.test({
  name: `"dereferenceAndDistill" should handle input dereference`,
  fn() {
    const distillSpy: Spy<void> = spy();
    const boundDistiller = dereferenceAndDistill(boundDereference, distillSpy);
    const schema = { $ref: "#/components/schemas/Pets" };
    const extraArg = `foo`;
    boundDistiller(schema, extraArg);
    assertNotStrictEquals(
      distillSpy.calls,
      [{ args: [petStore.components!.schemas!.Pets, extraArg] }],
    );
  },
});
Deno.test({
  name: `"dereferenceAndDistill" should set title to OAS schema references.`,
  fn() {
    const distillSpy: Spy<void> = spy();
    const boundDistiller = dereferenceAndDistill(boundDereference, distillSpy);
    const schema = { $ref: "#/components/schemas/Pets" };
    const extraArg = `foo`;
    boundDistiller(schema, extraArg);
    assertEquals(
      distillSpy.calls,
      [{
        args: [
          { ...petStore.components!.schemas!.Pets, title: `Pets` },
          extraArg,
        ],
      }],
    );
  },
});
Deno.test({
  name:
    `"dereferenceAndDistill" should memoize result when schema is a reference`,
  fn() {
    const distillSpy: Spy<void> = spy();
    const boundDistiller = dereferenceAndDistill(boundDereference, distillSpy);
    const schema = { $ref: "#/components/schemas/Pets" };
    const extraArg = `foo`;
    boundDistiller(schema, extraArg);
    boundDistiller(schema, extraArg);
    boundDistiller(schema, extraArg);
    boundDistiller(schema, extraArg);
    assertEquals(distillSpy.calls.length, 1);
  },
});
