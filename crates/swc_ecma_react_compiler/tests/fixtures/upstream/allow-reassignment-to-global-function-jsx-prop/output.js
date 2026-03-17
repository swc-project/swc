import { c as _c } from "react/compiler-runtime";
function Component() {
  const $ = _c(1);
  const onClick = _temp;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <div onClick={onClick} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp() {
  someUnknownGlobal = true;
  moduleLocal = true;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
