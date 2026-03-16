import { c as _c } from "react/compiler-runtime";
import { identity, shallowCopy, Stringify, useIdentity } from "shared-runtime";

type HasA = { kind: "hasA"; a: { value: number } };
type HasC = { kind: "hasC"; c: { value: number } };
function Foo(t0) {
  const $ = _c(7);
  const { cond } = t0;
  let t1;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = shallowCopy({ kind: "hasA", a: { value: 2 } });
    $[0] = t1;
  } else {
    t1 = $[0];
  }
  let x = t1;

  Math.max(x.a.value, 2);
  if (cond) {
    let t2;
    if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
      t2 = shallowCopy({ kind: "hasC", c: { value: 3 } });
      $[1] = t2;
    } else {
      t2 = $[1];
    }
    x = t2;
  }
  let t2;
  if ($[2] !== cond || $[3] !== x) {
    t2 = !cond && [(x as HasA).a.value + 2];
    $[2] = cond;
    $[3] = x;
    $[4] = t2;
  } else {
    t2 = $[4];
  }
  let t3;
  if ($[5] !== t2) {
    t3 = <Stringify val={t2} />;
    $[5] = t2;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  return t3;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ cond: false }],
  sequentialRenders: [{ cond: false }, { cond: true }],
};
