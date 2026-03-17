import { c as _c } from "react/compiler-runtime";
import { useIdentity, Stringify, identity } from "shared-runtime";

function Foo(t0) {
  const $ = _c(9);
  const { val1 } = t0;
  let t1;
  if ($[0] !== val1) {
    t1 = { inner: val1 };
    $[0] = val1;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const x = t1;
  let t2;
  if ($[2] !== x.inner) {
    t2 = () => x.inner;
    $[2] = x.inner;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const cb = useIdentity(t2);
  let t3;
  if ($[4] !== x) {
    t3 = identity(x);
    $[4] = x;
    $[5] = t3;
  } else {
    t3 = $[5];
  }
  const copy = t3;
  let t4;
  if ($[6] !== cb || $[7] !== copy) {
    t4 = <Stringify copy={copy} cb={cb} shouldInvokeFns={true} />;
    $[6] = cb;
    $[7] = copy;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  return t4;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ val1: 1 }],
  sequentialRenders: [{ val1: 1 }, { val1: 1 }],
};
