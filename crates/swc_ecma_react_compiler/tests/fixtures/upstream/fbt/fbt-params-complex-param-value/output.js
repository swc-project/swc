import { c as _c } from "react/compiler-runtime";
import fbt from "fbt";

function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props.name) {
    t0 = fbt._(
      "Hello {user name}",
      [fbt._param("user name", capitalize(props.name))],
      { hk: "2zEDKF" },
    );
    $[0] = props.name;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
