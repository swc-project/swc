function foo() {
  let y = 0;
  while (false) {
    y = y + 1;
  }

  return y;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
