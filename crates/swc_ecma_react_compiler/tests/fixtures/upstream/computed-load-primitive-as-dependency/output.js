import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false
function Component(props) {
  const $ = _c(2);
  const a = foo();

  const t0 = a[props.a] + 1;
  let t1;
  if ($[0] !== t0) {
    t1 = bar(t0);
    $[0] = t0;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const b = t1;
  return b;
}
