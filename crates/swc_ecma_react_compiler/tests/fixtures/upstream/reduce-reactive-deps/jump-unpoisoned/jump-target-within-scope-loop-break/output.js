import { c as _c } from "react/compiler-runtime";
function useFoo(t0) {
  const $ = _c(3);
  const { input, max } = t0;
  let x;
  if ($[0] !== input.a.b || $[1] !== max) {
    x = [];
    let i = 0;
    while (true) {
      i = i + 1;
      if (i > max) {
        break;
      }
    }

    x.push(i);
    x.push(input.a.b);
    $[0] = input.a.b;
    $[1] = max;
    $[2] = x;
  } else {
    x = $[2];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ input: { a: { b: 2 } }, max: 8 }],
  sequentialRenders: [
    { input: { a: { b: 2 } }, max: 8 },
    // preserve nullthrows
    { input: null, max: 8 },
    { input: {}, max: 8 },
    { input: { a: { b: null } }, max: 8 },
    { input: { a: null }, max: 8 },
    { input: { a: { b: 3 } }, max: 8 },
  ],
};
