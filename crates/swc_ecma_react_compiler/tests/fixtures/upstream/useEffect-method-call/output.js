let x = {};
function Component() {
  React.useEffect(_temp);
}
function _temp() {
  x.foo = 1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [],
};
