function Component(props) {
  if (props.cond) {
    return;
  }

  return props.value;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
