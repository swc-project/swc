import { c as _c } from "react/compiler-runtime";
function foo(a, b, c) {
  const $ = _c(6);
  let t0;
  if ($[0] !== a) {
    t0 = makeObject(a);
    $[0] = a;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const x = t0;

  const method = x.method;
  let t1;
  if ($[2] !== b || $[3] !== method || $[4] !== x) {
    t1 = method.call(x, b);
    $[2] = b;
    $[3] = method;
    $[4] = x;
    $[5] = t1;
  } else {
    t1 = $[5];
  }
  const y = t1;
  return y;
}
