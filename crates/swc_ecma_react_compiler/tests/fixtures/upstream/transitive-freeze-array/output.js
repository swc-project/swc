import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees
const { mutate } = require("shared-runtime");

function Component(props) {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    const x = {};
    const y = {};
    const items = [x, y];
    items.pop();
    mutate(y);
    t0 = [x, y, items];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
