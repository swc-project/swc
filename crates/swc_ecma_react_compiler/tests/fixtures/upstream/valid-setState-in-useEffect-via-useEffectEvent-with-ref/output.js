import { c as _c } from "react/compiler-runtime"; // @validateNoSetStateInEffects @enableAllowSetStateFromRefsInEffects @loggerTestOnly @compilationMode:"infer"
import { useState, useRef, useEffect, useEffectEvent } from "react";

function Component(t0) {
  const $ = _c(18);
  const { x, y } = t0;
  const previousXRef = useRef(null);
  const previousYRef = useRef(null);

  const [data, setData] = useState(null);
  let t1;
  if ($[0] !== x || $[1] !== y) {
    t1 = () => {
      const data_0 = load({ x, y });
      setData(data_0);
    };
    $[0] = x;
    $[1] = y;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const effectEvent = useEffectEvent(t1);
  let t2;
  if ($[3] !== effectEvent || $[4] !== x || $[5] !== y) {
    t2 = () => {
      const previousX = previousXRef.current;
      previousXRef.current = x;
      const previousY = previousYRef.current;
      previousYRef.current = y;
      if (!areEqual(x, previousX) || !areEqual(y, previousY)) {
        effectEvent();
      }
    };
    $[3] = effectEvent;
    $[4] = x;
    $[5] = y;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  let t3;
  if ($[7] !== x || $[8] !== y) {
    t3 = [x, y];
    $[7] = x;
    $[8] = y;
    $[9] = t3;
  } else {
    t3 = $[9];
  }
  useEffect(t2, t3);
  let t4;
  if ($[10] === Symbol.for("react.memo_cache_sentinel")) {
    t4 = (xx, yy) => {
      const previousX_0 = previousXRef.current;
      previousXRef.current = xx;
      const previousY_0 = previousYRef.current;
      previousYRef.current = yy;
      if (!areEqual(xx, previousX_0) || !areEqual(yy, previousY_0)) {
        const data_1 = load({ x: xx, y: yy });
        setData(data_1);
      }
    };
    $[10] = t4;
  } else {
    t4 = $[10];
  }
  const effectEvent2 = useEffectEvent(t4);
  let t5;
  if ($[11] !== effectEvent2 || $[12] !== x || $[13] !== y) {
    t5 = () => {
      effectEvent2(x, y);
    };
    $[11] = effectEvent2;
    $[12] = x;
    $[13] = y;
    $[14] = t5;
  } else {
    t5 = $[14];
  }
  let t6;
  if ($[15] !== x || $[16] !== y) {
    t6 = [x, y];
    $[15] = x;
    $[16] = y;
    $[17] = t6;
  } else {
    t6 = $[17];
  }
  useEffect(t5, t6);

  return data;
}

function areEqual(a, b) {
  return a === b;
}

function load({ x, y }) {
  return x * y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ x: 0, y: 0 }],
  sequentialRenders: [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ],
};
