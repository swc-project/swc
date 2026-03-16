import { c as _c } from "react/compiler-runtime";
import {
  identity,
  makeObject_Primitives,
  setPropertyByKey,
} from "shared-runtime";

/**
 * A bit of an edge case, but we could further optimize here by merging
 * re-orderability of nodes across phis.
 */
function useFoo(cond) {
  const $ = _c(5);
  let x;
  if (cond) {
    if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
      x = {};
      setPropertyByKey(x, "a", { b: 2 });
      $[0] = x;
    } else {
      x = $[0];
    }

    Math.max(x.a.b, 0);
  } else {
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
      x = makeObject_Primitives();
      setPropertyByKey(x, "a", { b: 3 });
      $[1] = x;
    } else {
      x = $[1];
    }

    Math.max(x.a.b, 0);
  }
  let y;
  if ($[2] !== cond || $[3] !== x) {
    y = [];
    if (identity(cond)) {
      y.push(x.a.b);
    }
    $[2] = cond;
    $[3] = x;
    $[4] = y;
  } else {
    y = $[4];
  }

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [true],
};
