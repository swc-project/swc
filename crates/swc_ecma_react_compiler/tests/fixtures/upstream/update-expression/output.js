import { c as _c } from "react/compiler-runtime";
function foo(props) {
  const $ = _c(4);
  let x = props.x;
  const y = x++;
  const z = x--;
  let t0;
  if ($[0] !== x || $[1] !== y || $[2] !== z) {
    t0 = { x, y, z };
    $[0] = x;
    $[1] = y;
    $[2] = z;
    $[3] = t0;
  } else {
    t0 = $[3];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{ x: 1 }],
  isComponent: false,
};
