import { c as _c } from "react/compiler-runtime";
import { arrayPush, mutate } from "shared-runtime";

function useFoo(t0) {
  const $ = _c(2);
  const { value } = t0;
  let items;
  if ($[0] !== value) {
    try {
      items = [];
      arrayPush(items, value);
    } catch {}

    mutate(items);
    $[0] = value;
    $[1] = items;
  } else {
    items = $[1];
  }
  return items;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ value: 2 }],
  sequentialRenders: [{ value: 2 }, { value: 2 }, { value: 3 }],
};
