function foo(props) {
  let y = 0;
  while (y < props.max) {
    y++;
  }

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [{ max: 10 }],
  isComponent: false,
};
