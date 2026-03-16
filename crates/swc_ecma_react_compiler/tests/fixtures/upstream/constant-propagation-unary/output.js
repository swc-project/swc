import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function foo() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <Stringify
        value={{
          _b: "baz",
          b0: false,
          n0: true,
          n1: false,
          n2: false,
          n3: false,
          s0: true,
          s1: false,
          s2: false,
          u: !undefined,
          n: true,
        }}
      />
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
