import { c as _c } from "react/compiler-runtime"; // @validatePreserveExistingMemoizationGuarantees @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
import { useCallback } from "react";

function Component(t0) {
  const $ = _c(2);
  const { entity, children } = t0;

  const showMessage = () => entity != null;

  if (!showMessage()) {
    return children;
  }
  let t1;
  if ($[0] !== children) {
    t1 = <div>{children}</div>;
    $[0] = children;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [
    {
      entity: { name: "Sathya" },
      children: [<div key="gsathya">Hi Sathya!</div>],
    },
  ],
};
