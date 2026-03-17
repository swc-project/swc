type Bar = string;
function TypeAliasUsedAsAnnotation() {
  const fun = _temp;

  fun("hello, world");
}
function _temp(f) {
  const g = f;
  console.log(g);
}

export const FIXTURE_ENTRYPOINT = {
  fn: TypeAliasUsedAsAnnotation,
  params: [],
};
