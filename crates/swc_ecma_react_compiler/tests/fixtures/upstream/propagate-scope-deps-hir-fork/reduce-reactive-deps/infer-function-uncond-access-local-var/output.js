import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR

import { mutate, shallowCopy, Stringify } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(4);
  const { a } = t0;
  let local;
  if ($[0] !== a) {
    local = shallowCopy(a);
    mutate(local);
    $[0] = a;
    $[1] = local;
  } else {
    local = $[1];
  }
  let t1;
  if ($[2] !== local.b.c) {
    const fn = () => local.b.c;
    t1 = <Stringify fn={fn} shouldInvokeFns={true} />;
    $[2] = local.b.c;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ a: null }],
  sequentialRenders: [{ a: null }, { a: { b: { c: 4 } } }],
};
