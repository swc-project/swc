import { mutate, useNoAlias } from "shared-runtime";

function Component(props) {
  const x = [];
  useNoAlias();
  mutate(x);

  return <div>{x}</div>;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: 42 }],
};
