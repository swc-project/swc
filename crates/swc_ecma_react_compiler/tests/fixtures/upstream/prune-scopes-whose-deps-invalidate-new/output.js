import { useHook } from "shared-runtime";

function Component(props) {
  const x = new Foo();
  useHook();
  x.value = props.value;

  const y = { x };

  return { y };
}

class Foo {}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "sathya" }],
};
