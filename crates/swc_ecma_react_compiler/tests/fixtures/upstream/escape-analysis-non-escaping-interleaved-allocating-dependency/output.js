import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(5);
  let t0;
  if ($[0] !== props.a) {
    t0 = [props.a];
    $[0] = props.a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const a = t0;
  let b;
  if ($[2] !== a || $[3] !== props.b) {
    b = [];
    const c = {};
    c.a = a;
    b.push(props.b);
    $[2] = a;
    $[3] = props.b;
    $[4] = b;
  } else {
    b = $[4];
  }

  return b;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
