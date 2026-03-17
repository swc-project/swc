import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";
function Component(t0) {
  const $ = _c(2);
  const { a } = t0;
  let t1;
  if ($[0] !== a) {
    const z = { a };
    const p = () => <Stringify>{z}</Stringify>;
    t1 = p();
    $[0] = a;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 1 }],
  sequentialRenders: [{ a: 1 }, { a: 1 }, { a: 2 }],
};
