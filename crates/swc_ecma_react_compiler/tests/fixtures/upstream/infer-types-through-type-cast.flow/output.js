import { getNumber } from "shared-runtime";

function Component(props) {
  const x = getNumber();

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{}],
  isComponent: false,
};
