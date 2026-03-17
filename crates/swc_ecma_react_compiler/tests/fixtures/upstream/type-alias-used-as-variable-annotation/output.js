// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsVariableAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  const g = f;
  console.log(g);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsVariableAnnotation,
  params: [],
};
