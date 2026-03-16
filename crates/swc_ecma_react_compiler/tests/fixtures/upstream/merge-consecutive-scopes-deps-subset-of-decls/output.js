import { c as _c } from "react/compiler-runtime";
import { useState } from "react";

function Component() {
  const $ = _c(2);
  const [count, setCount] = useState(0);
  let t0;
  if ($[0] !== count) {
    t0 = (
      <div>
        <button onClick={() => setCount(count - 1)}>Decrement</button>

        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>
    );
    $[0] = count;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
