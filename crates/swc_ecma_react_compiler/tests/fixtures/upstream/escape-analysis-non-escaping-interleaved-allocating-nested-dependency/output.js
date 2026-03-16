import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(5);
  let t0;
  if ($[0] !== props.a) {
    const a = [props.a];
    t0 = [a];
    $[0] = props.a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const b = t0;
  let c;
  if ($[2] !== b || $[3] !== props.b) {
    c = [];
    const d = {};
    d.b = b;
    c.push(props.b);
    $[2] = b;
    $[3] = props.b;
    $[4] = c;
  } else {
    c = $[4];
  }

  return c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
