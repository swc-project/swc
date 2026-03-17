import { c as _c } from "react/compiler-runtime";
import { makeObject_Primitives, mutate } from "shared-runtime";

function Component() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const a = makeObject_Primitives();
    const x = [];
    x.push(a);
    mutate(x);
    t0 = [x, a];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  isComponent: false,
};
