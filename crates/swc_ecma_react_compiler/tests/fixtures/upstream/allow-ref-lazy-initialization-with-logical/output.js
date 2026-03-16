import { c as _c } from "react/compiler-runtime"; // @validateRefAccessDuringRender

import { useRef } from "react";

function Component(props) {
  const $ = _c(1);
  const ref = useRef(null);
  if (ref.current == null) {
    ref.current = props.unknownKey ?? props.value;
  }
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Child ref={ref} />;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

function Child({ ref }) {
  "use no memo";
  return ref.current;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};
