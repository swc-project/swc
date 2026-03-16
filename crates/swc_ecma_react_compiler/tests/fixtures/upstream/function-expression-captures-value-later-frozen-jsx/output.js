import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(3);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = {};
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const x = t0;
  let t1;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    t1 = (e) => {
      maybeMutate(x, e.target.value);
    };
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const onChange = t1;

  if (props.cond) {
  }
  let t2;
  if ($[2] === Symbol.for("react.memo_cache_sentinel")) {
    t2 = <Foo value={x} onChange={onChange} />;
    $[2] = t2;
  } else {
    t2 = $[2];
  }
  return t2;
}
