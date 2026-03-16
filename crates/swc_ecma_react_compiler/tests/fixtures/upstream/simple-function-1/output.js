function component() {
  const x = _temp;

  return x;
}
function _temp(a) {
  a.foo();
}

export const FIXTURE_ENTRYPOINT = {
  fn: component,
  params: [],
  isComponent: false,
};
