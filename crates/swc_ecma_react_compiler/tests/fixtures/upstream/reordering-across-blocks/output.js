import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function Component(t0) {
  const $ = _c(9);
  const { config } = t0;
  let t1;
  if ($[0] !== config) {
    t1 = (event) => {
      config?.onA?.(event);
    };
    $[0] = config;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  const a = t1;
  let t2;
  if ($[2] !== config) {
    t2 = (event_0) => {
      config?.onB?.(event_0);
    };
    $[2] = config;
    $[3] = t2;
  } else {
    t2 = $[3];
  }
  const b = t2;
  let t3;
  if ($[4] !== a || $[5] !== b) {
    t3 = { b, a };
    $[4] = a;
    $[5] = b;
    $[6] = t3;
  } else {
    t3 = $[6];
  }
  const object = t3;
  let t4;
  if ($[7] !== object) {
    t4 = <Stringify value={object} />;
    $[7] = object;
    $[8] = t4;
  } else {
    t4 = $[8];
  }
  return t4;
}
