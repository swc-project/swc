import { c as _c } from "react/compiler-runtime";
import { identity } from "shared-runtime";

function Component(t0) {
  const $ = _c(2);
  let t1;
  if ($[0] !== t0) {
    t1 = t0 === undefined ? identity([_temp, true, 42, "hello"]) : t0;
    $[0] = t0;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const x = t1;
  return x;
}
function _temp() {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};
