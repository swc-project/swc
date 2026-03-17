import { c as _c } from "react/compiler-runtime";
import { arrayPush } from "shared-runtime";

function Foo(cond) {
  const $ = _c(2);
  let x;
  if ($[0] !== cond) {
    x = null;
    if (cond) {
      x = [];
    }

    arrayPush(x, 2);
    $[0] = cond;
    $[1] = x;
  } else {
    x = $[1];
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ cond: true }],
  sequentialRenders: [{ cond: true }, { cond: true }],
};
