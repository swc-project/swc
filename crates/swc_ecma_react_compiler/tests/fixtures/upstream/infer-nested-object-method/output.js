import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"

import { Stringify } from "shared-runtime";

function Test() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const context = {
      testFn() {
        return _temp;
      },
    };
    t0 = <Stringify value={context} shouldInvokeFns={true} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}
function _temp() {
  return "test";
}

export const FIXTURE_ENTRYPOINT = {
  fn: Test,
  params: [{}],
};
