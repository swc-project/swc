import { c as _c } from "react/compiler-runtime";
function Component(t0) {
  const $ = _c(6);
  const { obj, arg } = t0;
  try {
    let t1;
    if ($[0] !== arg || $[1] !== obj) {
      t1 = obj?.method?.(arg.value);
      $[0] = arg;
      $[1] = obj;
      $[2] = t1;
    } else {
      t1 = $[2];
    }
    const result = t1;
    const t2 = result ?? "no result";
    let t3;
    if ($[3] !== t2) {
      t3 = <span>{t2}</span>;
      $[3] = t2;
      $[4] = t3;
    } else {
      t3 = $[4];
    }
    return t3;
  } catch {
    let t1;
    if ($[5] === Symbol.for("react.memo_cache_sentinel")) {
      t1 = <span>error</span>;
      $[5] = t1;
    } else {
      t1 = $[5];
    }
    return t1;
  }
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [
    {
      obj: {
        method: (x) => {
          return "called:" + x;
        },
      },
      arg: { value: 1 },
    },
  ],
  sequentialRenders: [
    {
      obj: {
        method: (x) => {
          return "called:" + x;
        },
      },
      arg: { value: 1 },
    },
    {
      obj: {
        method: (x) => {
          return "called:" + x;
        },
      },
      arg: { value: 1 },
    },
    {
      obj: {
        method: (x) => {
          return "different:" + x;
        },
      },
      arg: { value: 2 },
    },
    { obj: { method: null }, arg: { value: 3 } },
    { obj: { notMethod: true }, arg: { value: 4 } },
    { obj: null, arg: { value: 5 } }, // obj is null, short-circuits so arg.value is NOT evaluated
    {
      obj: {
        method: (x) => {
          return "test:" + x;
        },
      },
      arg: null,
    }, // errors because arg.value throws WITHIN the optional call
  ],
};
