import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  const [, setValue] = useState(null);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (e) => setValue((value_0) => value_0 + e.target.value);
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const onChange = t0;

  useOtherHook();
  let x;
  if ($[1] === Symbol.for("react.memo_cache_sentinel")) {
    x = {};
    foo(x, onChange);
    $[1] = x;
  } else {
    x = $[1];
  }
  return x;
}
