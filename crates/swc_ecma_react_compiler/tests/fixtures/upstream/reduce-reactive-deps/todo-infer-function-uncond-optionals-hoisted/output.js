import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(2);
  const { a } = t0;
  let t1;
  if ($[0] !== a.b?.c.d?.e) {
    t1 = <Stringify fn={() => a.b?.c.d?.e} shouldInvokeFns={true} />;
    $[0] = a.b?.c.d?.e;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ a: null }],
  sequentialRenders: [
    { a: null },
    { a: { b: null } },
    { a: { b: { c: { d: null } } } },
    { a: { b: { c: { d: { e: 4 } } } } },
  ],
};
