import { c as _c } from "react/compiler-runtime"; // @enablePreserveExistingMemoizationGuarantees:false @enableTransitivelyFreezeFunctionExpressions:false
import { useCallback } from "react";
import {
  identity,
  logValue,
  makeObject_Primitives,
  useHook,
} from "shared-runtime";

function Component(props) {
  const $ = _c(2);
  const object = makeObject_Primitives();

  useHook();

  const log = () => {
    logValue(object);
  };

  const onClick = () => {
    log();
  };

  identity(object);
  let t0;
  if ($[0] !== onClick) {
    t0 = <div onClick={onClick} />;
    $[0] = onClick;
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
