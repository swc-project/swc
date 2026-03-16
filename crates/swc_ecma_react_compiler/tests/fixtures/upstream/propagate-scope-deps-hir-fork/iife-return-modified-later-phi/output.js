import { c as _c } from "react/compiler-runtime"; // @enablePropagateDepsInHIR
function Component(props) {
  const $ = _c(3);
  let items;
  if ($[0] !== props.a || $[1] !== props.cond) {
    let t0;
    if (props.cond) {
      t0 = [];
    } else {
      t0 = null;
    }
    items = t0;

    items?.push(props.a);
    $[0] = props.a;
    $[1] = props.cond;
    $[2] = items;
  } else {
    items = $[2];
  }
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ a: {} }],
};
