import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  for (const i = props.init; i < 10; ) {
    if (i === 0) {
      x = 0;
      break;
    } else {
      x = 1;
      break;
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
    { init: 0 },
    { init: 0 },
    { init: 10 },
    { init: 10 },
    { init: 0 },
    { init: 10 },
    { init: 0 },
    { init: 10 },
  ],
};
