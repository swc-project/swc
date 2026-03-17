import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function useMakeCallback(t0) {
  const $ = _c(3);
  const { obj, setState } = t0;
  let t1;
  if ($[0] !== obj.value || $[1] !== setState) {
    t1 = <Stringify cb={() => setState(obj.value)} shouldInvokeFns={true} />;
    $[0] = obj.value;
    $[1] = setState;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}

const setState = (arg: number) => {
  "use no memo";
  return arg;
};
export const FIXTURE_ENTRYPOINT = {
  fn: useMakeCallback,
  params: [{ obj: { value: 1 }, setState }],
  sequentialRenders: [
    { obj: { value: 1 }, setState },
    { obj: { value: 2 }, setState },
  ],
};
