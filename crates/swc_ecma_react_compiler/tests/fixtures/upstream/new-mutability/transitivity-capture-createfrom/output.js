import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false @validateExhaustiveMemoizationDependencies:false
import { useMemo } from "react";
import {
  typedCapture,
  typedCreateFrom,
  typedMutate,
  ValidateMemoization,
} from "shared-runtime";

function Component(t0) {
  const $ = _c(9);
  const { a, b } = t0;
  let x;
  if ($[0] !== a || $[1] !== b) {
    x = { a };
    const y = typedCapture(x);
    const z = typedCreateFrom(y);

    typedMutate(z, b);
    $[0] = a;
    $[1] = b;
    $[2] = x;
  } else {
    x = $[2];
  }
  let t1;
  if ($[3] !== a || $[4] !== b) {
    t1 = [a, b];
    $[3] = a;
    $[4] = b;
    $[5] = t1;
  } else {
    t1 = $[5];
  }
  let t2;
  if ($[6] !== t1 || $[7] !== x) {
    t2 = <ValidateMemoization inputs={t1} output={x} />;
    $[6] = t1;
    $[7] = x;
    $[8] = t2;
  } else {
    t2 = $[8];
  }
  return t2;
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
