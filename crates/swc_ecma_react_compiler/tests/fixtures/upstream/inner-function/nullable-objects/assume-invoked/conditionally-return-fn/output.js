import { c as _c } from "react/compiler-runtime";
import { createHookWrapper } from "shared-runtime";

/**
 * Assume that conditionally returned functions can be invoked and that their
 * property loads are hoistable to the function declaration site.
 */
function useMakeCallback(t0) {
  const $ = _c(3);
  const { obj, shouldMakeCb, setState } = t0;
  let t1;
  if ($[0] !== obj.value || $[1] !== setState) {
    t1 = () => setState(obj.value);
    $[0] = obj.value;
    $[1] = setState;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  const cb = t1;
  if (shouldMakeCb) {
    return cb;
  } else {
    return null;
  }
}

const setState = (arg: number) => {
  "use no memo";
  return arg;
};
export const FIXTURE_ENTRYPOINT = {
  fn: createHookWrapper(useMakeCallback),
  params: [{ obj: { value: 1 }, shouldMakeCb: true, setState }],
  sequentialRenders: [
    { obj: { value: 1 }, shouldMakeCb: true, setState },
    { obj: { value: 2 }, shouldMakeCb: true, setState },
  ],
};
