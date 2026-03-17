import { c as _c } from "react/compiler-runtime";
import { useMemo } from "react";
import {
  typedCapture,
  typedCreateFrom,
  typedMutate,
  ValidateMemoization,
} from "shared-runtime";

function Component(t0) {
  const $ = _c(7);
  const { a, b } = t0;
  let t1;
  if ($[0] !== a) {
    t1 = [{ a }];
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const x = t1;
  const y = typedCreateFrom(x);
  const z = typedCapture(y);

  typedMutate(z, b);
  let t2;
  if ($[2] !== a) {
    t2 = [a];
    $[2] = a;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t2 || $[5] !== x) {
    t3 = <ValidateMemoization inputs={t2} output={x} />;
    $[4] = t2;
    $[5] = x;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 0, b: 0 }],
  sequentialRenders: [
    { a: 0, b: 0 },
    { a: 0, b: 1 },
    { a: 1, b: 1 },
    { a: 0, b: 0 },
  ],
};
