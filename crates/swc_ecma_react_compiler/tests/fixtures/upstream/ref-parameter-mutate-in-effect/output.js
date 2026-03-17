import { c as _c } from "react/compiler-runtime";
import { useEffect } from "react";

function Foo(props, ref) {
  const $ = _c(5);
  let t0;
  if ($[0] !== ref) {
    t0 = () => {
      ref.current = 2;
    };
    $[0] = ref;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  let t1;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = [];
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  useEffect(t0, t1);
  let t2;
  if ($[3] !== props.bar) {
    t2 = <div>{props.bar}</div>;
    $[3] = props.bar;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ bar: "foo" }, { ref: { current: 1 } }],
  isComponent: true,
};
