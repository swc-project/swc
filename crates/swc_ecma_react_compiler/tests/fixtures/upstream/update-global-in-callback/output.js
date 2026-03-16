import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

let renderCount = 0;
function Foo() {
  const $ = _c(1);
  const cb = _temp;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Stringify cb={cb} shouldInvokeFns={true} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp() {
  renderCount = renderCount + 1;
  return renderCount;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};
