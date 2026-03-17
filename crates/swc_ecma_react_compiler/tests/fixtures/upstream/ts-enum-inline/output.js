import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  enum Bool {
    True = "true",
    False = "false",
  }

  let bool = Bool.False;
  if (props.value) {
    bool = Bool.True;
  }
  let t0;
  if ($[0] !== bool) {
    t0 = <div>{bool}</div>;
    $[0] = bool;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: true }],
};
