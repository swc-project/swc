import { useHook } from "shared-runtime";

function Component(props) {
  const x = {};
  useHook();
  x.value = props.value;

  const y = { x };

  return { y };
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: "sathya" }],
};
