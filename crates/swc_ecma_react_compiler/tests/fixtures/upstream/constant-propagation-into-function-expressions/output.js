import { c as _c } from "react/compiler-runtime";
import { Stringify, identity } from "shared-runtime";

function Component(props) {
  const $ = _c(1);

  const onEvent = _temp;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Stringify onEvent={onEvent} shouldInvokeFns={true} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp() {
  return identity(42);
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  sequentialRenders: [{}, {}],
};
