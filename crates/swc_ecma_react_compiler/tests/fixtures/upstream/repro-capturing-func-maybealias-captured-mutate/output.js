import { c as _c } from "react/compiler-runtime"; // @enableNewMutationAliasingModel
import { makeArray, mutate } from "shared-runtime";

/**
 * Bug repro, fixed in the new mutability/aliasing inference.
 *
 * Previous issue:
 *
 * Fork of `capturing-func-alias-captured-mutate`, but instead of directly
 * aliasing `y` via `[y]`, we make an opaque call.
 *
 * Note that the bug here is that we don't infer that `a = makeArray(y)`
 * potentially captures a context variable into a local variable. As a result,
 * we don't understand that `a[0].x = b` captures `x` into `y` -- instead, we're
 * currently inferring that this lambda captures `y` (for a potential later
 * mutation) and simply reads `x`.
 *
 * Concretely `InferReferenceEffects.hasContextRefOperand` is incorrectly not
 * used when we analyze CallExpressions.
 */
function Component(t0) {
  const $ = _c(3);
  const { foo, bar } = t0;
  let y;
  if ($[0] !== bar || $[1] !== foo) {
    const x = { foo };
    y = { bar };
    const f0 = function () {
      const a = makeArray(y);
      const b = x;

      a[0].x = b;
    };

    f0();
    mutate(y.x);
    $[0] = bar;
    $[1] = foo;
    $[2] = y;
  } else {
    y = $[2];
  }
  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ foo: 3, bar: 4 }],
  sequentialRenders: [
    { foo: 3, bar: 4 },
    { foo: 3, bar: 5 },
  ],
};
