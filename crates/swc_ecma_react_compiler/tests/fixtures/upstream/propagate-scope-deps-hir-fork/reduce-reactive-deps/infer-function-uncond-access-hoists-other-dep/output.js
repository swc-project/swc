import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR

import { identity, makeArray, Stringify, useIdentity } from "shared-runtime";

function Foo(t0) {
  const $ = _c(8);
  const { a, cond } = t0;
  let t1;
  if ($[0] !== a) {
    t1 = () => [a, a.b.c];
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const fn = t1;
  useIdentity(null);
  let x;
  if ($[2] !== a.b.c || $[3] !== cond) {
    x = makeArray();
    if (cond) {
      x.push(identity(a.b.c));
    }
    $[2] = a.b.c;
    $[3] = cond;
    $[4] = x;
  } else {
    x = $[4];
  }
  let t2;
  if ($[5] !== fn || $[6] !== x) {
    t2 = <Stringify fn={fn} x={x} shouldInvokeFns={true} />;
    $[5] = fn;
    $[6] = x;
    $[7] = t2;
  } else {
    t2 = $[7];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ a: null, cond: true }],
  sequentialRenders: [
    { a: null, cond: true },
    { a: { b: { c: 4 } }, cond: true },
    { a: { b: { c: 4 } }, cond: true },
  ],
};
