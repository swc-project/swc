import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(3);
  const [x, setX] = useState(null);
  let t0;
  if ($[0] === Symbol.for("react.memo_cache_sentinel")) {
    t0 = (e) => {
      setX(_temp);
    };
    $[0] = t0;
  } else {
    t0 = $[0];
  }
  const onChange = t0;
  let t1;
  if ($[1] !== x) {
    t1 = <input value={x} onChange={onChange} />;
    $[1] = x;
    $[2] = t1;
  } else {
    t1 = $[2];
  }
  return t1;
}
function _temp(currentX) {
  return currentX + null;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
