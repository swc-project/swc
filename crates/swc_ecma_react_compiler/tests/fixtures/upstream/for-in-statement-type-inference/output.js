// @enablePreserveExistingMemoizationGuarantees:false
const { identity, mutate } = require("shared-runtime");

function Component(props) {
  let x;
  const object = { ...props.value };
  for (const y in object) {
    x = y;
  }

  mutate(x);
  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ value: { a: "a", b: "B", c: "C!" } }],
};
