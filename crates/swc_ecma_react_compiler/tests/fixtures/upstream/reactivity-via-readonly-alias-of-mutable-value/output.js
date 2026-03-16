import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  const x = [];
  const y = x;

  const z = [y];

  y.push(props.input);

  const a = [z];

  let b = 0;
  if (a[0][0][0] === 42) {
    b = 1;
  }
  let t0;
  if ($[0] !== b) {
    t0 = [b];
    $[0] = b;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
  sequentialRenders: [
    { input: 42 },
    { input: 42 },
    { input: "sathya" },
    { input: "sathya" },
    { input: 42 },
    { input: "sathya" },
    { input: 42 },
    { input: "sathya" },
  ],
};
