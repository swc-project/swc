import { c as _c } from "react/compiler-runtime"; // @enableTransitivelyFreezeFunctionExpressions:false
import {
  Stringify,
  mutate,
  identity,
  setPropertyByKey,
  shallowCopy,
} from "shared-runtime";
/**
 * Function expression version of `aliased-nested-scope-truncated-dep`.
 *
 * In this fixture, the output would be invalid if propagateScopeDeps did not
 * avoid adding MemberExpression dependencies which would other evaluate during
 * the mutable ranges of their base objects.
 * This is different from `aliased-nested-scope-truncated-dep` which *does*
 * produce correct output regardless of MemberExpression dependency truncation.
 *
 * Note while other expressions evaluate inline, function expressions *always*
 * represent deferred evaluation. This means that
 * (1) it's always safe to reorder function expression creation until its
 *     earliest potential invocation
 * (2) it's invalid to eagerly evaluate function expression dependencies during
 *     their respective mutable ranges.
 */

function Component(t0) {
  const $ = _c(2);
  const { prop } = t0;
  let t1;
  if ($[0] !== prop) {
    const obj = shallowCopy(prop);
    const aliasedObj = identity(obj);
    const getId = () => obj.id;
    mutate(aliasedObj);
    setPropertyByKey(aliasedObj, "id", prop.id + 1);
    t1 = <Stringify getId={getId} shouldInvokeFns={true} />;
    $[0] = prop;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ prop: { id: 1 } }],
  sequentialRenders: [
    { prop: { id: 1 } },
    { prop: { id: 1 } },
    { prop: { id: 2 } },
  ],
};
