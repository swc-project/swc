import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);

  const x = [];
  if (props.cond) {
    x.push(1);
  }

  let y = false;
  switch (x[0]) {
    case 1: {
      y = true;
    }
  }
  let t0;
  if ($[0] !== y) {
    t0 = [y];
    $[0] = y;
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
    { cond: true },
    { cond: true },
    { cond: false },
    { cond: false },
    { cond: true },
    { cond: false },
    { cond: true },
    { cond: false },
  ],
};
