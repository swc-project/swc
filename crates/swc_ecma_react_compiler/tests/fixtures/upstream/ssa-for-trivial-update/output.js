function foo() {
  let x = 1;
  for (const i = 0; true; 0) {
    x = x + 1;
  }

  return x;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: [],
  isComponent: false,
};
