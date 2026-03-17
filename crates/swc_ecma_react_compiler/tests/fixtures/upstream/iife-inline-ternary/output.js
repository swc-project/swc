function Component(props) {
  props.foo ? 1 : _temp();
  return items;
}
function _temp() {
  throw new Error("Did not receive 1");
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ foo: true }],
};
