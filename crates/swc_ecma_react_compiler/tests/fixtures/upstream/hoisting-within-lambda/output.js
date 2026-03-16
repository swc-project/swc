import { c as _c } from "react/compiler-runtime";
function Component(t0) {
  const $ = _c(1);
  const outer = _temp;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = <div>{outer()}</div>;
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  return t1;
}
function _temp() {
  const inner = () => x;
  const x = 3;
  return inner();
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
