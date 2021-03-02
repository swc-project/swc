import { Spy, spy } from "https://deno.land/x/mock@v0.9.4/mod.ts";
import {
  assertEquals,
  assertNotStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.80.0/testing/asserts.ts";

import { OpenAPIV3, R } from "../../deps.ts";
import { HttpMethod } from "../types.d.ts";
import {
  Context,
  DistillationHooks,
  distillOperation,
} from "./index.ts";

const noop = R.always(undefined);
const simpleOperation = (operationId: string): OpenAPIV3.OperationObject => ({
  operationId,
  responses: {
    200: {
      description: `Success`,
      content: {
        [`application/json`]: {
          schema: {
            type: `boolean`,
          },
        },
      },
    },
  },
});
const testDistillOperation = (operation: OpenAPIV3.OperationObject, {
  // deno-lint-ignore no-explicit-any
  boundDereference = R.identity as any,
  boundDistillArguments = noop,
  boundDistillOutputType = noop,
  httpMethod = `get`,
  onOperationDistilled,
  path = `/some/path`,
}: {
  boundDistillArguments?: Parameters<typeof distillOperation>[1];
  boundDistillOutputType?: Parameters<typeof distillOperation>[2];
  boundDereference?: Context[`boundDereference`];
  httpMethod?: HttpMethod;
  onOperationDistilled?: DistillationHooks["onOperationDistilled"];
  path?: string;
} = {}) =>
  distillOperation(
    { boundDereference, hooks: { onOperationDistilled } },
    boundDistillArguments,
    boundDistillOutputType,
  )(
    path,
    httpMethod,
    operation,
  );

Deno.test({
  name: `"distillOperation" should throw when 'operationId' is void`,
  fn() {
    assertThrows(() => testDistillOperation({}));
    assertThrows(() => testDistillOperation({ operationId: `` }));
  },
});

Deno.test({
  name:
    `"distillOperation" should throw when 'operationId' is not a valid GraphQL name`,
  fn() {
    assertThrows(() =>
      testDistillOperation({ operationId: `1_number_at_start` })
    );
    assertThrows(() =>
      testDistillOperation({ operationId: `_undercore_at_start` })
    );
    assertThrows(() => testDistillOperation({ operationId: `use-hyphen` }));
  },
});

Deno.test(
  {
    name:
      `"distillOperation" should throw when there is not defined a success response`,
    fn() {
      assertThrows(() =>
        testDistillOperation({ operationId: `validOperationId` })
      );
      assertThrows(() =>
        testDistillOperation({ operationId: `validOperationId`, responses: {} })
      );
      assertThrows(() =>
        testDistillOperation({
          operationId: `validOperationId`,
          responses: { 404: { description: "Not found" } },
        })
      );
    },
  },
);

Deno.test({
  name:
    `"distillOperation" should call "onOperationDistilled" hook when defined`,
  fn() {
    const path = `/some/path`;
    const httpMethod = `get`;
    const operationId = `validOperationId`;
    const onOperationDistilled: Spy<void> = spy();
    const result = testDistillOperation(
      simpleOperation(operationId),
      { httpMethod, onOperationDistilled, path },
    );
    assertNotStrictEquals(onOperationDistilled.calls, [
      { args: [path, httpMethod, operationId] },
    ]);
  },
});
