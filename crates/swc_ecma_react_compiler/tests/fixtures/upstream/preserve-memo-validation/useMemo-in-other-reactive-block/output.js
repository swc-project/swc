import { c as _c } from "react/compiler-runtime"; // @validatePreserveExistingMemoizationGuarantees
import { useMemo, useState } from "react";
import { arrayPush } from "shared-runtime";

// useMemo-produced values can exist in nested reactive blocks, as long
// as their reactive dependencies are a subset of depslist from source
function useFoo(minWidth, otherProp) {
  const $ = _c(6);
  const [width] = useState(1);
  let t0;
  if ($[0] !== minWidth || $[1] !== otherProp || $[2] !== width) {
    const x = [];
    const t1 = Math.max(minWidth, width);
    let t2;
    if ($[4] !== t1) {
      t2 = { width: t1 };
      $[4] = t1;
      $[5] = t2;
    } else {
      t2 = $[5];
    }
    const style = t2;
    arrayPush(x, otherProp);
    t0 = [style, x];
    $[0] = minWidth;
    $[1] = otherProp;
    $[2] = width;
    $[3] = t0;
  } else {
    t0 = $[3];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [2, "other"],
};
