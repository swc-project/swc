import { c as _c } from "react/compiler-runtime";
function useFoo(t0) {
  const $ = _c(3);
  const { obj, objIsNull } = t0;
  let x;
  if ($[0] !== obj || $[1] !== objIsNull) {
    x = [];
    for (let i = 0; i < 5; i++) {
      if (objIsNull) {
        continue;
      }

      x.push(obj.a);
    }
    $[0] = obj;
    $[1] = objIsNull;
    $[2] = x;
  } else {
    x = $[2];
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ obj: null, objIsNull: true }],
  sequentialRenders: [
    { obj: null, objIsNull: true },
    { obj: { a: 2 }, objIsNull: false },
    // check we preserve nullthrows
    { obj: { a: undefined }, objIsNull: false },
    { obj: undefined, objIsNull: false },
    { obj: { a: undefined }, objIsNull: false },
  ],
};
