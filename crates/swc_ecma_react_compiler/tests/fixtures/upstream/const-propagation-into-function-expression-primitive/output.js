function foo() {
  const f = _temp;

  f();
  return 42;
}
function _temp() {
  console.log(42);
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
