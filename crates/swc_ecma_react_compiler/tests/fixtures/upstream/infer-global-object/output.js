import { c as _c } from "react/compiler-runtime";
import { identity, sum } from "shared-runtime";

// Check that we correctly resolve type and effect lookups on the javascript
// global object.
function Component(props) {
  const $ = _c(4);
  let t0;
  if ($[0] !== props.b) {
    t0 = identity(props.b);
    $[0] = props.b;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const neverAliasedOrMutated = t0;
  const primitiveVal1 = Math.max(props.a, neverAliasedOrMutated);

  const primitiveVal3 = globalThis.globalThis.NaN;

  sum(primitiveVal1, Infinity, primitiveVal3);
  let t1;
  if ($[2] !== primitiveVal1) {
    t1 = { primitiveVal1, primitiveVal2: Infinity, primitiveVal3 };
    $[2] = primitiveVal1;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 1, b: 2 }],
  isComponent: false,
};
