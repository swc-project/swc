import { c as _c } from "react/compiler-runtime";
import { arrayPush } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(3);
  const { cond, value } = t0;
  let items;
  if ($[0] !== cond || $[1] !== value) {
    bb0: {
      items = [];

      if (cond) {
        break bb0;
      }
      arrayPush(items, value);
    }

    arrayPush(items, value);
    $[0] = cond;
    $[1] = value;
    $[2] = items;
  } else {
    items = $[2];
  }
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ cond: true, value: 2 }],
  sequentialRenders: [
    { cond: true, value: 2 },
    { cond: true, value: 2 },
    { cond: true, value: 3 },
    { cond: false, value: 3 },
  ],
};
