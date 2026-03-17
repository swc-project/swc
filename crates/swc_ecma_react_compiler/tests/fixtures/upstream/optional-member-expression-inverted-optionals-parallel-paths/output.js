import { c as _c } from "react/compiler-runtime"; // @validatePreserveExistingMemoizationGuarantees @enableOptionalDependencies
import { ValidateMemoization } from "shared-runtime";
function Component(props) {
  const $ = _c(2);

  const x$0 = [];
  x$0.push(props?.a.b?.c.d?.e);
  x$0.push(props.a?.b.c?.d.e);
  let t0;
  if ($[0] !== props.a.b.c.d.e) {
    t0 = <ValidateMemoization inputs={[props.a.b.c.d.e]} output={x} />;
    $[0] = props.a.b.c.d.e;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  return t0;
}
