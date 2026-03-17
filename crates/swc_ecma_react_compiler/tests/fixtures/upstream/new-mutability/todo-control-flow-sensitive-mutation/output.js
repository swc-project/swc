import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false @validateExhaustiveMemoizationDependencies:false
import { useMemo } from "react";
import {
  mutate,
  typedCapture,
  typedCreateFrom,
  typedMutate,
  ValidateMemoization,
} from "shared-runtime";

function Component(t0) {
  const $ = _c(21);
  const { a, b, c } = t0;
  let x;
  if ($[0] !== a || $[1] !== b || $[2] !== c) {
    x = [{ value: a }];
    if (b === 0) {
      x.push({ value: c });
    } else {
      mutate(x);
    }
    $[0] = a;
    $[1] = b;
    $[2] = c;
    $[3] = x;
  } else {
    x = $[3];
  }
  let t1;
  if ($[4] !== a || $[5] !== b || $[6] !== c) {
    t1 = [a, b, c];
    $[4] = a;
    $[5] = b;
    $[6] = c;
    $[7] = t1;
  } else {
    t1 = $[7];
  }
  let t2;
  if ($[8] !== t1 || $[9] !== x) {
    t2 = <ValidateMemoization inputs={t1} output={x} />;
    $[8] = t1;
    $[9] = x;
    $[10] = t2;
  } else {
    t2 = $[10];
  }
  let t3;
  if ($[11] !== a || $[12] !== b || $[13] !== c) {
    t3 = [a, b, c];
    $[11] = a;
    $[12] = b;
    $[13] = c;
    $[14] = t3;
  } else {
    t3 = $[14];
  }
  let t4;
  if ($[15] !== t3 || $[16] !== x[0]) {
    t4 = <ValidateMemoization inputs={t3} output={x[0]} />;
    $[15] = t3;
    $[16] = x[0];
    $[17] = t4;
  } else {
    t4 = $[17];
  }
  let t5;
  if ($[18] !== t2 || $[19] !== t4) {
    t5 = (
      <>
        {t2};{t4};
      </>
    );
    $[18] = t2;
    $[19] = t4;
    $[20] = t5;
  } else {
    t5 = $[20];
  }
  return t5;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 0, b: 0, c: 0 }],
  sequentialRenders: [
    { a: 0, b: 0, c: 0 },
    { a: 0, b: 1, c: 0 },
    { a: 1, b: 1, c: 0 },
    { a: 1, b: 1, c: 1 },
    { a: 1, b: 1, c: 0 },
    { a: 1, b: 0, c: 0 },
    { a: 0, b: 0, c: 0 },
  ],
};
