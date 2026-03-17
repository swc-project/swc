import { c as _c } from "react/compiler-runtime";
import { useMemo } from "react";
import * as SharedRuntime from "shared-runtime";

export function Component(t0) {
  const $ = _c(27);
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
  let items;
  if ($[4] !== item1 || $[5] !== item2) {
    items = [];
    SharedRuntime.typedArrayPush(items, item1);
    SharedRuntime.typedArrayPush(items, item2);
    $[4] = item1;
    $[5] = item2;
    $[6] = items;
  } else {
    items = $[6];
  }
  const items_0 = items;
  let t3;
  if ($[7] !== a) {
    t3 = [a];
    $[7] = a;
    $[8] = t3;
  } else {
    t3 = $[8];
  }
  let t4;
  if ($[9] !== items_0[0] || $[10] !== t3) {
    t4 = <SharedRuntime.ValidateMemoization inputs={t3} output={items_0[0]} />;
    $[9] = items_0[0];
    $[10] = t3;
    $[11] = t4;
  } else {
    t4 = $[11];
  }
  let t5;
  if ($[12] !== b) {
    t5 = [b];
    $[12] = b;
    $[13] = t5;
  } else {
    t5 = $[13];
  }
  let t6;
  if ($[14] !== items_0[1] || $[15] !== t5) {
    t6 = <SharedRuntime.ValidateMemoization inputs={t5} output={items_0[1]} />;
    $[14] = items_0[1];
    $[15] = t5;
    $[16] = t6;
  } else {
    t6 = $[16];
  }
  let t7;
  if ($[17] !== a || $[18] !== b) {
    t7 = [a, b];
    $[17] = a;
    $[18] = b;
    $[19] = t7;
  } else {
    t7 = $[19];
  }
  let t8;
  if ($[20] !== items_0 || $[21] !== t7) {
    t8 = <SharedRuntime.ValidateMemoization inputs={t7} output={items_0} />;
    $[20] = items_0;
    $[21] = t7;
    $[22] = t8;
  } else {
    t8 = $[22];
  }
  let t9;
  if ($[23] !== t4 || $[24] !== t6 || $[25] !== t8) {
    t9 = (
      <>
        {t4}
        {t6}
        {t8}
      </>
    );
    $[23] = t4;
    $[24] = t6;
    $[25] = t8;
    $[26] = t9;
  } else {
    t9 = $[26];
  }
  return t9;
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
