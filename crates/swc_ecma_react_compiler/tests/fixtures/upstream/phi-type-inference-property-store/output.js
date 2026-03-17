import { c as _c } from "react/compiler-runtime"; // @debug
function Component(props) {
  const $ = _c(4);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;
  let t1;
  if ($[1] !== props.a || $[2] !== props.cond) {
    let y;
    if (props.cond) {
      y = {};
    } else {
      y = { a: props.a };
    }
    y.x = x;
    t1 = [x, y];
    $[1] = props.a;
    $[2] = props.cond;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ cond: false, a: "a!" }],
};
