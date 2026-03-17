import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR
import { Stringify } from "shared-runtime";

function Foo(t0) {
  const $ = _c(3);
  const { a, shouldReadA } = t0;
  let t1;
  if ($[0] !== a || $[1] !== shouldReadA) {
    t1 = (
      <Stringify
        objectMethod={{
          method() {
            if (shouldReadA) {
              return a.b.c;
            }
            return null;
          },
        }}
        shouldInvokeFns={true}
      />
    );
    $[0] = a;
    $[1] = shouldReadA;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ a: null, shouldReadA: true }],
  sequentialRenders: [
    { a: null, shouldReadA: true },
    { a: null, shouldReadA: false },
    { a: { b: { c: 4 } }, shouldReadA: true },
  ],
};
