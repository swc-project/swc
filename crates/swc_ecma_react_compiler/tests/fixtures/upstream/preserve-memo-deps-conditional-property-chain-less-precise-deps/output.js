import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees @validatePreserveExistingMemoizationGuarantees @enableOptionalDependencies

import { useMemo } from "react";
import { identity, ValidateMemoization } from "shared-runtime";

function Component(t0) {
  const $ = _c(11);
  const { x } = t0;
  let t1;
  if ($[0] !== x.y) {
    t1 = identity({ callback: () => identity(x.y.z) });
    $[0] = x.y;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const object = t1;
  let t2;
  if ($[2] !== object) {
    t2 = object.callback();
    $[2] = object;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  let t3;
  if ($[4] !== t2) {
    t3 = [t2];
    $[4] = t2;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  const result = t3;
  let t4;
  if ($[6] !== x.y) {
    t4 = [x.y];
    $[6] = x.y;
    $[7] = t4;
  } else {
    t4 = $[7];
  }
  let t5;
  if ($[8] !== result || $[9] !== t4) {
    t5 = <ValidateMemoization inputs={t4} output={result} />;
    $[8] = result;
    $[9] = t4;
    $[10] = t5;
  } else {
    t5 = $[10];
  }
  return t5;
}

const input1 = { x: { y: { z: 42 } } };
const input1b = { x: { y: { z: 42 } } };
const input2 = { x: { y: { z: 3.14 } } };
export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [input1],
  sequentialRenders: [
    input1,
    input1,
    input1b, // should reset even though .z didn't change
    input1,
    input2,
  ],
};
