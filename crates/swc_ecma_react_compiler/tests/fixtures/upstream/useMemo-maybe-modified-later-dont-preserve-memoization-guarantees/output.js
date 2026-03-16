import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false
import { useMemo } from "react";
import { identity, makeObject_Primitives, mutate } from "shared-runtime";

function Component(props) {
  const $ = _c(1);
  let object;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    object = makeObject_Primitives();
    identity(object);
    $[0] = object;
  } else {
    object = $[0];
  }
  return object;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
