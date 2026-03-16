import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(3);
  const wat = _temp;

  const pathname_0 = props.wat;
  const deeplinkItemId = pathname_0 ? props.itemID : null;
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = () => wat();
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  let t1;
  if ($[1] !== deeplinkItemId) {
    t1 = <button onClick={t0}>{deeplinkItemId}</button>;
    $[1] = deeplinkItemId;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}
function _temp() {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ wat: "/dev/null", itemID: 42 }],
};
