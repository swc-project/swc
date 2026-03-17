import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

/**
 * Example showing that returned inner function expressions should not be
 * typed with `freeze` effects.
 */
function Foo(t0) {
  "use memo";
  const $ = _c(3);
  const { a, b } = t0;
  let t1;
  if ($[0] !== a || $[1] !== b) {
    const obj = {};
    const updaterFactory = () => (newValue) => {
      obj.value = newValue;
      obj.a = a;
    };
    const updater = updaterFactory();
    updater(b);
    t1 = <Stringify cb={obj} shouldInvokeFns={true} />;
    $[0] = a;
    $[1] = b;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ a: 1, b: 2 }],
  sequentialRenders: [
    { a: 1, b: 2 },
    { a: 1, b: 3 },
  ],
};
