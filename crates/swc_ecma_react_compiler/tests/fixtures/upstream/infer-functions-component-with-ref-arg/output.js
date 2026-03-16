import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"

function Foo(t0, ref) {
  const $ = _c(2);
  let t1;
  if ($[0] !== ref) {
    t1 = <div ref={ref} />;
    $[0] = ref;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{}],
};
