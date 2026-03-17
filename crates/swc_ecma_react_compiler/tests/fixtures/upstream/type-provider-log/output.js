import { c as _c } from "react/compiler-runtime";
import { useMemo } from "react";
import { typedLog, ValidateMemoization } from "shared-runtime";

export function Component(t0) {
  const $ = _c(17);
  const { a, b } = t0;
  let t1;
  if ($[0] !== a) {
    t1 = { a };
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const item1 = t1;
  let t2;
  if ($[2] !== b) {
    t2 = { b };
    $[2] = b;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const item2 = t2;
  typedLog(item1, item2);
  let t3;
  if ($[4] !== a) {
    t3 = [a];
    $[4] = a;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  let t4;
  if ($[6] !== item1 || $[7] !== t3) {
    t4 = <ValidateMemoization inputs={t3} output={item1} />;
    $[6] = item1;
    $[7] = t3;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  let t5;
  if ($[9] !== b) {
    t5 = [b];
    $[9] = b;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  let t6;
  if ($[11] !== item2 || $[12] !== t5) {
    t6 = <ValidateMemoization inputs={t5} output={item2} />;
    $[11] = item2;
    $[12] = t5;
    $[13] = t6;
  } else {
    t6 = $[13];
  }
  let t7;
  if ($[14] !== t4 || $[15] !== t6) {
    t7 = (
      <>
        {t4}
        {t6}
      </>
    );
    $[14] = t4;
    $[15] = t6;
    $[16] = t7;
  } else {
    t7 = $[16];
  }
  return t7;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 0, b: 0 }],
  sequentialRenders: [
    { a: 0, b: 0 },
    { a: 1, b: 0 },
    { a: 1, b: 1 },
    { a: 1, b: 2 },
    { a: 2, b: 2 },
    { a: 3, b: 2 },
    { a: 0, b: 0 },
  ],
};
