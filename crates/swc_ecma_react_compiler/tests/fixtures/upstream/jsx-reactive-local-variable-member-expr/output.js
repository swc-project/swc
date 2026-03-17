import { c as _c } from "react/compiler-runtime";
import * as sharedRuntime from "shared-runtime";

function Component(t0) {
  const $ = _c(2);
  const { something } = t0;
  const Foo = something.StaticText1;
  let t1;
  if ($[0] !== Foo) {
    t1 = () => <Foo />;
    $[0] = Foo;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ something: sharedRuntime }],
};
