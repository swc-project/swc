import { c as _c } from "react/compiler-runtime";
function useFoo(props) {
  const $ = _c(6);
  let x;
  if ($[0] !== props.bar) {
    x = [];
    x.push(props.bar);
    $[0] = props.bar;
    $[1] = x;
  } else {
    x = $[1];
  }
  if ($[2] !== props.bar || $[3] !== props.cond || $[4] !== props.foo) {
    props.cond ? ((x = []), x.push(props.foo)) : ((x = []), x.push(props.bar));
    $[2] = props.bar;
    $[3] = props.cond;
    $[4] = props.foo;
    $[5] = x;
  } else {
    x = $[5];
  }
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: useFoo,
  params: [{ cond: false, foo: 2, bar: 55 }],
  sequentialRenders: [
    { cond: false, foo: 2, bar: 55 },
    { cond: false, foo: 3, bar: 55 },
    { cond: true, foo: 3, bar: 55 },
  ],
};
