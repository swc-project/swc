function Component(props) {
  const x = props.default;

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ default: 42 }],
};
