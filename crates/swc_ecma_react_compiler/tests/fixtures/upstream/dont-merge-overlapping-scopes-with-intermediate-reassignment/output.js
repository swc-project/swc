import { c as _c } from "react/compiler-runtime";
import { Stringify } from "shared-runtime";

function Component(props) {
  const $ = _c(7);
  let x;
  let t0;
  if ($[0] !== props.count) {
    t0 = [props.count];
    $[0] = props.count;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const array = t0;
  x = array;
  let t1;
  if ($[2] !== array) {
    t1 = <div>{array}</div>;
    $[2] = array;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  const element = t1;
  let t2;
  if ($[4] !== element || $[5] !== x) {
    t2 = (
      <div>
        {element}
        {x}
      </div>
    );
    $[4] = element;
    $[5] = x;
    $[6] = t2;
  } else {
    t2 = $[6];
  }
  return t2;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ count: 42 }],
};
