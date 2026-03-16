import { c as _c } from "react/compiler-runtime";
import { fbs } from "fbt";

function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props.name) {
    t0 = (
      <div
        title={fbs._(
          "Hello {user name}",
          [fbs._param("user name", props.name)],
          { hk: "2zEDKF" },
        )}
      >
        Hover me
      </div>
    );
    $[0] = props.name;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ name: "Sathya" }],
};
