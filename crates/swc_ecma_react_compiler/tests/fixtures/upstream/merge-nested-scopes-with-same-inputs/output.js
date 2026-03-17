import { c as _c } from "react/compiler-runtime";
import { setProperty } from "shared-runtime";

function Component(props) {
  const $ = _c(2);
  let y;
  if ($[0] !== props.a) {
    y = {};

    const x = {};
    setProperty(x, props.a);

    y.a = props.a;
    y.x = x;
    $[0] = props.a;
    $[1] = y;
  } else {
    y = $[1];
  }

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: 42 }],
};
