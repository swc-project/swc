import { c as _c } from "react/compiler-runtime";
import { mutate, setProperty, throwErrorWithMessageIf } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(6);
  const { value, cond } = t0;
  let t1;
  let y;
  if ($[0] !== cond || $[1] !== value) {
    t1 = Symbol.for("react.early_return_sentinel");
    bb0: {
      y = [value];
      let x;
      if ($[4] !== cond) {
        x = { cond };
        try {
          mutate(x);
          throwErrorWithMessageIf(x.cond, "error");
        } catch {
          setProperty(x, "henderson");
          t1 = x;
          break bb0;
        }

        setProperty(x, "nevada");
        $[4] = cond;
        $[5] = x;
      } else {
        x = $[5];
      }
      y.push(x);
    }
    $[0] = cond;
    $[1] = value;
    $[2] = t1;
    $[3] = y;
  } else {
    t1 = $[2];
    y = $[3];
  }
  if (t1 !== Symbol.for("react.early_return_sentinel")) {
    return t1;
  }

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ value: 4, cond: true }],
  sequentialRenders: [
    { value: 4, cond: true },
    { value: 5, cond: true },
    { value: 5, cond: false },
  ],
};
