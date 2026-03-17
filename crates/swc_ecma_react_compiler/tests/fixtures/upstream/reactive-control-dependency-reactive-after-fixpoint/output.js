import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let x = 0;

  let value = null;
  for (let i = 0; i < 10; i++) {
    switch (value) {
      case true: {
        x = 1;
        break;
      }
      case false: {
        x = 2;
        break;
      }
    }

    value = props.cond;
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
