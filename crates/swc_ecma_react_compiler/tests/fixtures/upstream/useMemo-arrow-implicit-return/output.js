import { c as _c } from "react/compiler-runtime"; // @validateNoVoidUseMemo
function Component() {
  const $ = _c(2);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = computeValue();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const value = t0;
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <div>{value}</div>;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}
