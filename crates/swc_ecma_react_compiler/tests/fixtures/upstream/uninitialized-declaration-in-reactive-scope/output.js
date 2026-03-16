import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = mutate();
    let y;
    foo(x);
    t0 = [y, x];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
