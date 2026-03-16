import { c as _c } from "react/compiler-runtime";
import { useEffect, useState } from "react";

let someGlobal = { value: null };

function Component() {
  const $ = _c(5);
  const [state, setState] = useState(someGlobal);

  let x = someGlobal;
  while (x == null) {
    x = someGlobal;
  }

  const y = x;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => {
      y.value = "hello";
    };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  useEffect(t0);
  let t1;
  let t2;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = () => {
      setState(someGlobal.value);
    };
    t2 = [someGlobal];
    $[1] = t1;
    $[2] = t2;
  } else {
    t1 = $[1];
    t2 = $[2];
  }
  useEffect(t1, t2);

  const t3 = String(state);
  let t4;
  if ($[3] !== t3) {
    t4 = <div>{t3}</div>;
    $[3] = t3;
    $[4] = t4;
  } else {
    t4 = $[4];
  }
  return t4;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
