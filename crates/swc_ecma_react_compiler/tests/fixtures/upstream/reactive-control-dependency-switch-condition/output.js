import { c as _c } from "react/compiler-runtime";
const GLOBAL = 42;

function Component(t0) {
  const $ = _c(2);
  const { value } = t0;
  let x;
  bb0: switch (GLOBAL) {
    case value: {
      x = 1;
      break bb0;
    }
    default: {
      x = 2;
    }
  }
  let t1;
  if ($[0] !== x) {
    t1 = [x];
    $[0] = x;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    { value: GLOBAL },
    { value: GLOBAL },
    { value: null },
    { value: null },
    { value: GLOBAL },
    { value: null },
    { value: GLOBAL },
    { value: null },
  ],
};
