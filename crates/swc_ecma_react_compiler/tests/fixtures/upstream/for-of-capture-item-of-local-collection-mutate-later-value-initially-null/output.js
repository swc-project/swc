import { c as _c } from "react/compiler-runtime";
import { makeObject_Primitives } from "shared-runtime";

function Component(props) {
  const $ = _c(1);
  let items;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    let lastItem = null;
    items = [makeObject_Primitives(), makeObject_Primitives()];
    for (const x of items) {
      lastItem = x;
    }

    if (lastItem != null) {
      lastItem.a = lastItem.a + 1;
    }
    $[0] = items;
  } else {
    items = $[0];
  }

  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  sequentialRenders: [{}, {}, {}],
};
