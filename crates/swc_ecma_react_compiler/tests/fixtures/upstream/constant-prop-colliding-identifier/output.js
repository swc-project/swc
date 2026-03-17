import { invoke } from "shared-runtime";

function Component() {
  const fn = _temp;

  invoke(fn);

  return 3;
}
function _temp() {
  return { x: "value" };
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
};
