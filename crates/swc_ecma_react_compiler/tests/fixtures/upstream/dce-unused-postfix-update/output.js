function Component(props) {
  let i;

  i = props.i;
  return i;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Component,
  params: [{ i: 42 }],
};
