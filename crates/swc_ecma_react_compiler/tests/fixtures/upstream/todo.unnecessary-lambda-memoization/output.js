import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(4);
  const data = useFreeze();
  let t0;
  if ($[0] !== data.items) {
    t0 = data.items.map(_temp);
    $[0] = data.items;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const items = t0;
  let t1;
  if ($[2] !== items) {
    t1 = <div>{items}</div>;
    $[2] = items;
    $[3] = t1;
  } else {
    t1 = $[3];
  }
  return t1;
}
function _temp(item) {
  return <Item item={item} />;
}
