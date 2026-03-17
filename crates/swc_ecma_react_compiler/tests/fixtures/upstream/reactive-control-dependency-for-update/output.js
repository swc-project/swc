import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x;
  for (let i = 0; i < 10; i = i + props.update, i) {
    if (i > 0 && i % 2 === 0) {
      x = 2;
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
    { update: 2 },
    { update: 2 },
    { update: 1 },
    { update: 1 },
    { update: 2 },
    { update: 1 },
    { update: 2 },
    { update: 1 },
  ],
};
