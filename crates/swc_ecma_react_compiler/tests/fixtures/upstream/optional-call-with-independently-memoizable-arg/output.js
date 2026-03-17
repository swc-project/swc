import { c as _c } from "react/compiler-runtime";
function Component(props) {
  const $ = _c(2);
  let t0;
  if ($[0] !== props) {
    const x = makeOptionalFunction(props);
    t0 = x?.(
      <div>
        <span>{props.text}</span>
      </div>,
    );
    $[0] = props;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  const y = t0;
  return y;
}
