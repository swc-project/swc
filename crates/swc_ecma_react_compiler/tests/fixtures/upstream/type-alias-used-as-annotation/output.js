// @enableAssumeHooksFollowRulesOfReact @enableTransitivelyFreezeFunctionExpressions
type Bar = string;
function TypeAliasUsedAsParamAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  console.log(f);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsParamAnnotation,
  params: [],
};
