import { c as _c } from "react/compiler-runtime";
function Foo() {
  const $ = _c(2);
  let getX;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    getX = () => x;
    console.log(getX());

    let x = 4;
    x = x + 5;
    $[0] = getX;
  } else {
    getX = $[0];
  }
  x;
  let t0;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = <Stringify getX={getX} shouldInvokeFns={true} />;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [],
};
