import { c as _c } from "react/compiler-runtime";
import { setProperty } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(3);
  const { o, branchCheck } = t0;
  let x;
  if ($[0] !== branchCheck || $[1] !== o.value) {
    x = {};
    if (branchCheck) {
      setProperty(x, o.value);
    } else {
      if (o.value) {
        setProperty(x, o.value);
      } else {
        setProperty(x, o.value);
      }
    }
    $[0] = branchCheck;
    $[1] = o.value;
    $[2] = x;
  } else {
    x = $[2];
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ o: { value: 2 }, branchCheck: false }],
};
