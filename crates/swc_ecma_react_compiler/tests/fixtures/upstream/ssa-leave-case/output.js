import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function Component(props) {
  const $ = _c(3);
  let t0;
  if ($[0] !== props.p0 || $[1] !== props.p1) {
    const x = [];
    let y;
    if (props.p0) {
      x.push(props.p1);
      y = x;
    }
    t0 = (
      <Stringify>
        {x}
        {y}
      </Stringify>
    );
    $[0] = props.p0;
    $[1] = props.p1;
    $[2] = t0;
  } else {
    t0 = $[2];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ p0: false, p1: 2 }],
  sequentialRenders: [
    { p0: false, p1: 2 },
    { p0: false, p1: 2 },
    { p0: true, p1: 2 },
    { p0: true, p1: 3 },
  ],
};
