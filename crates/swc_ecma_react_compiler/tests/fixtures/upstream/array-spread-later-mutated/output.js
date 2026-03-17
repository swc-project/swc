import { c as _c } from "react/compiler-runtime";
function useBar(t0) {
  const $ = _c(2);
  const { arg } = t0;
  let arr;
  if ($[0] !== arg) {
    const obj = {};
    const s = new Set([obj, 5, 4]);
    const mutableIterator = s.values();
    arr = [...mutableIterator];

    obj.x = arg;
    $[0] = arg;
    $[1] = arr;
  } else {
    arr = $[1];
  }
  return arr;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useBar,
  params: [{ arg: 3 }],
  sequentialRenders: [{ arg: 3 }, { arg: 3 }, { arg: 4 }],
};
