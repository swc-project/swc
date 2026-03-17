import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  for (let i = 0; i < props.test; i++) {
    if (i > 10) {
      x = 10;
    } else {
      x = 1;
    }
  }
  let t0;
  if ($[0] !== x) {
    t0 = [x];
    $[0] = x;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    { test: 12 },
    { test: 12 },
    { test: 1 },
    { test: 1 },
    { test: 12 },
    { test: 1 },
    { test: 12 },
    { test: 1 },
  ],
};
