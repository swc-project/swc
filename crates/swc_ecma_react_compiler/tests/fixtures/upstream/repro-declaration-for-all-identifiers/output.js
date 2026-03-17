import { c as _c } from "react/compiler-runtime";
function Foo() {
  const $ = _c(1);
  try {
    for (let i = 0; i < 2; i++) {}
  } catch {}
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <span>ok</span>;
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
  sequentialRenders: [{}, {}, {}],
};
