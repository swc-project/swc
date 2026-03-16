import { c as _c } from "react/compiler-runtime";
function Foo(props) {
  const $ = _c(2);
  let rest;
  if ($[0] !== props.a) {
    const { unused, ...t0 } = props.a;
    rest = t0;
    $[0] = props.a;
    $[1] = rest;
  } else {
    rest = $[1];
  }
  return rest;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
