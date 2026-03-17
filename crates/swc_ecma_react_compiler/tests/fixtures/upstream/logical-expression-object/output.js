import { c as _c } from "react/compiler-runtime";
function component(props) {
  const $ = _c(3);

  const a = props.a || (props.b && props.c && props.d);
  const b = (props.a && props.b && props.c) || props.d;
  let t0;
  if ($[0] !== a || $[1] !== b) {
    t0 = { a, b };
    $[0] = a;
    $[1] = b;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
