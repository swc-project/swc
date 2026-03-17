import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  const id = useSelectedEntitytId();
  let t0;
  if ($[0] !== id) {
    const onLoad = () => {
      log(id);
    };
    t0 = <Foo onLoad={onLoad} />;
    $[0] = id;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
