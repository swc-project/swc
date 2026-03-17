import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(1);

  const a = [];
  const b = [];
  b.push(props.cond);
  a.push(null);

  const c = [a];

  let x;
  for (const i of c[0]) {
    x = 1;
  }
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = [x];
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ cond: true }],
};
