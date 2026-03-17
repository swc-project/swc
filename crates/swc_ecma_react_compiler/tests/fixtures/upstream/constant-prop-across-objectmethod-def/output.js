import { identity } from "shared-runtime";

// repro for context identifier scoping bug, in which x was
// inferred as a context variable.

function Component() {
  const obj = { method() {} };

  identity(obj);

  return 4;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
