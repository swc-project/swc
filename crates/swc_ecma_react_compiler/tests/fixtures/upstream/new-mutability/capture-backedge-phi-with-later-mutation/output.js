import { c as _c } from "react/compiler-runtime"; // @enableNewMutationAliasingModel
import { arrayPush, Stringify } from "shared-runtime";

function Component(t0) {
  "use memo";
  const $ = _c(5);
  const { prop1, prop2 } = t0;
  let z;
  if ($[0] !== prop1 || $[1] !== prop2) {
    let x = [{ value: prop1 }];
    while (x.length < 2) {
      arrayPush(x, { value: prop2 });

      if (x[0].value === prop1) {
        x = [{ value: prop2 }];
        const y = x;
        z = y[0];
      }
    }

    z.other = true;
    $[0] = prop1;
    $[1] = prop2;
    $[2] = z;
  } else {
    z = $[2];
  }
  let t1;
  if ($[3] !== z) {
    t1 = <Stringify z={z} />;
    $[3] = z;
    $[4] = t1;
  } else {
    t1 = $[4];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ prop1: 0, prop2: "a" }],
  sequentialRenders: [
    { prop1: 0, prop2: "a" },
    { prop1: 1, prop2: "a" },
    { prop1: 1, prop2: "b" },
    { prop1: 0, prop2: "b" },
    { prop1: 0, prop2: "a" },
  ],
};
