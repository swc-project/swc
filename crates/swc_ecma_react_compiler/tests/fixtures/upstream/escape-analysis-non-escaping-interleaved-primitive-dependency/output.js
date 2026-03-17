import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(3);

  const a = props.a + props.b;
  let b;
  if ($[0] !== a || $[1] !== props.c) {
    b = [];
    const c = {};
    c.a = a;
    b.push(props.c);
    $[0] = a;
    $[1] = props.c;
    $[2] = b;
  } else {
    b = $[2];
  }

  return b;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
