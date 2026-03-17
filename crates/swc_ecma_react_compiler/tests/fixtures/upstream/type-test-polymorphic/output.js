import { c as _c } from "react/compiler-runtime";
function component() {
  const $ = _c(1);
  const p = makePrimitive();
  let x;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const o = {};
    x = {};

    x.t = p;

    x.t = o;
    $[0] = x;
  } else {
    x = $[0];
  }
  const y = x.t;
  return y;
}
