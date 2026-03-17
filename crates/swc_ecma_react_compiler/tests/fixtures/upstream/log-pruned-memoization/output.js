import { c as _c } from "react/compiler-runtime"; // @loggerTestOnly
import { createContext, use, useState } from "react";
import {
  Stringify,
  identity,
  makeObject_Primitives,
  useHook,
} from "shared-runtime";

function Component() {
  const $ = _c(6);
  const w = use(Context);

  const x = makeObject_Primitives();
  const x2 = makeObject_Primitives();
  useState(null);
  identity(x);
  identity(x2);

  const y = useHook();
  let z;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    z = [];
    for (let i = 0; i < 10; i++) {
      const obj = makeObject_Primitives();
      z.push(obj);
    }
    $[0] = z;
  } else {
    z = $[0];
  }
  let t0;
  if ($[1] !== w || $[2] !== x || $[3] !== x2 || $[4] !== y) {
    t0 = <Stringify items={[w, x, x2, y, z]} />;
    $[1] = w;
    $[2] = x;
    $[3] = x2;
    $[4] = y;
    $[5] = t0;
  } else {
    t0 = $[5];
  }
  return t0;
}

const Context = createContext();

function Wrapper() {
  const $ = _c(1);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (
      <Context value={42}>
        <Component />
      </Context>
    );
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Wrapper,
  params: [{}],
};
