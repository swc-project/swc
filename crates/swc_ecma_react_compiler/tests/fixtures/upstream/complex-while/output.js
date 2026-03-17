function foo(a, b, c) {
  bb0: if (a) {
    while (b) {
      if (c) {
        break bb0;
      }
    }
  }

  return c;
}

export const FIXTURE_ENTRYPOINT = {
  fn: foo,
  params: ["TodoAdd"],
  isComponent: "TodoAdd",
};
