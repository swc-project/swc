import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(7);
  let b;
  if ($[0] !== props.a) {
    const { a, ...t0 } = props.a;
    b = t0;
    $[0] = props.a;
    $[1] = b;
  } else {
    b = $[1];
  }
  let d;
  if ($[2] !== props.c) {
    [, ...d] = props.c;
    $[2] = props.c;
    $[3] = d;
  } else {
    d = $[3];
  }
  let t0;
  if ($[4] !== b || $[5] !== d) {
    t0 = <div b={b} d={d} />;
    $[4] = b;
    $[5] = d;
    $[6] = t0;
  } else {
    t0 = $[6];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
