import { c as _c } from "react/compiler-runtime"; // @validateNoSetStateInEffects @loggerTestOnly @compilationMode:"infer"
import { useEffect, useEffectEvent, useState } from "react";

const shouldSetState = false;

function Component() {
  const $ = _c(7);
  const [state, setState] = useState(0);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => {
      setState(10);
    };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const effectEvent = useEffectEvent(t0);
  let t1;
  if ($[1] !== effectEvent) {
    t1 = () => {
      setTimeout(effectEvent, 10);
    };
    $[1] = effectEvent;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  useEffect(t1);
  let t2;
  if ($[3] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = () => {
      setTimeout(() => {
        setState(20);
      }, 10);
    };
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const effectEventWithTimeout = useEffectEvent(t2);
  let t3;
  if ($[4] !== effectEventWithTimeout) {
    t3 = () => {
      effectEventWithTimeout();
    };
    $[4] = effectEventWithTimeout;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  let t4;
  if ($[6] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = [];
    $[6] = t4;
  } else {
    t4 = $[6];
  }
  useEffect(t3, t4);
  return state;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
